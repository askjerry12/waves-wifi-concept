#!/usr/bin/env node
/*
  Static listing generator
  - Reads /data/properties.json
  - Applies /template.html
  - Outputs /listings/<slug>/index.html

  Idempotent + safe to re-run.
*/

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, 'data', 'properties.json');
const TEMPLATE_PATH = path.join(ROOT, 'template.html');
const LISTINGS_DIR = path.join(ROOT, 'listings');
const HOMEPAGE_PATH = path.join(ROOT, 'homepage.html');

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function get(obj, keyPath) {
  if (!keyPath) return undefined;
  const parts = keyPath.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function isEmpty(val) {
  if (val == null) return true;
  if (typeof val === 'boolean') return !val;   // false = empty, true = not empty
  if (typeof val === 'number') return val === 0;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === 'string') return val.trim() === '';
  return false;
}

// Minimal template engine:
// - {{field}}
// - {{#if field}}...{{/if}} (field can be nested)
// - {{#each field}}...{{/each}} (arrays)
// - supports {{this}}, {{@index}}, and {{nested.field}} inside each
// Nesting-aware block extractor: finds matching closing tag respecting nesting depth
function extractBlock(tpl, openTag, closeTag, startPos) {
  // startPos = index right after the opening tag's closing "}}"
  let depth = 1;
  let i = startPos;
  while (i < tpl.length && depth > 0) {
    const nextOpen = tpl.indexOf(openTag, i);
    const nextClose = tpl.indexOf(closeTag, i);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + openTag.length;
    } else {
      depth--;
      if (depth === 0) return { inner: tpl.slice(startPos, nextClose), end: nextClose + closeTag.length };
      i = nextClose + closeTag.length;
    }
  }
  return null;
}

function processEachBlocks(tpl, data, ctx) {
  const OPEN = '{{#each ';
  const CLOSE = '{{/each}}';
  let result = '';
  let i = 0;
  while (i < tpl.length) {
    const start = tpl.indexOf(OPEN, i);
    if (start === -1) { result += tpl.slice(i); break; }
    result += tpl.slice(i, start);
    const keyEnd = tpl.indexOf('}}', start + OPEN.length);
    if (keyEnd === -1) { result += tpl.slice(start); break; }
    const key = tpl.slice(start + OPEN.length, keyEnd).trim();
    const block = extractBlock(tpl, OPEN, CLOSE, keyEnd + 2);
    if (!block) { result += tpl.slice(start); break; }
    let arr = (data.this && typeof data.this === 'object') ? get(data.this, key) : undefined;
    if (!Array.isArray(arr)) arr = get(data, key);
    if (Array.isArray(arr) && arr.length > 0) {
      result += arr.map((item, idx) => render(block.inner, { ...data, this: item }, { ...ctx, this: item, '@index': idx })).join('');
    }
    i = block.end;
  }
  return result;
}

function processIfBlocks(tpl, data, ctx) {
  const OPEN = '{{#if ';
  const CLOSE = '{{/if}}';
  let result = '';
  let i = 0;
  while (i < tpl.length) {
    const start = tpl.indexOf(OPEN, i);
    if (start === -1) { result += tpl.slice(i); break; }
    result += tpl.slice(i, start);
    const keyEnd = tpl.indexOf('}}', start + OPEN.length);
    if (keyEnd === -1) { result += tpl.slice(start); break; }
    const key = tpl.slice(start + OPEN.length, keyEnd).trim();
    const block = extractBlock(tpl, OPEN, CLOSE, keyEnd + 2);
    if (!block) { result += tpl.slice(start); break; }
    let v = (data.this && typeof data.this === 'object') ? get(data.this, key) : undefined;
    if (v === undefined) v = get(data, key);
    if (!isEmpty(v)) result += render(block.inner, data, ctx);
    i = block.end;
  }
  return result;
}

function render(tpl, data, ctx = {}) {
  tpl = processEachBlocks(tpl, data, ctx);
  tpl = processIfBlocks(tpl, data, ctx);

  // variables
  tpl = tpl.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, raw) => {
    const key = raw.trim();
    if (key === 'this') return escapeHtml(ctx.this ?? data.this ?? '');
    if (key === '@index') return String(ctx['@index'] ?? '');

    // allow each-item object properties: {{url}} inside each
    let v = get(data.this && typeof data.this === 'object' ? data.this : {}, key);
    if (v === undefined) v = get(data, key);

    if (v === undefined || v === null) return '';
    return escapeHtml(v);
  });

  return tpl;
}

function buildIxAttrs(property) {
  // Produces placeholders like {{__IX_ATTR_name__}} replaced with data-ix-field attrs
  // so Intel tooltip system can attach per-field meta from property.intel.
  const fields = [
    // core
    'name','address','rating','tagline','website','email','phone','instagram',
    // highlights
    'beach_distance','wifi_speed','unique_feature','community_feature',
    // sections
    'about_description','amenities','community_description','community_photos','coworking_description','coworking_photos','rooms','faqs',
    // booking + details
    'booking_url','booking_primary_url','whatsapp','min_stay','price_from','payment','cancellation','check_in','check_out',
    // map
    'latlng'
  ];
  const map = {};
  for (const f of fields) {
    map[`__IX_ATTR_${f}__`] = `data-ix-field=\"${f}\"`;
  }
  return map;
}

async function main() {
  await fsp.mkdir(LISTINGS_DIR, { recursive: true });

  const [tplRaw, dataRaw] = await Promise.all([
    fsp.readFile(TEMPLATE_PATH, 'utf8'),
    fsp.readFile(DATA_PATH, 'utf8')
  ]);

  const properties = JSON.parse(dataRaw);
  if (!Array.isArray(properties)) throw new Error('properties.json must be an array');

  // Inline CSS from original index.html to keep 1-file-per-page style.
  // We reuse the <style> block content from existing /index.html if present.
  const indexHtmlPath = path.join(ROOT, 'index.html');
  let inlineCss = '';
  try {
    const idx = await fsp.readFile(indexHtmlPath, 'utf8');
    const m = idx.match(/<style>([\s\S]*?)<\/style>/i);
    inlineCss = m ? m[1].trim() : '';
  } catch {
    inlineCss = '';
  }

  // Build homepage listing JSON (cards)
  const homepageListings = properties.map(p => ({
    slug: p.slug,
    name: p.name || p.slug,
    city: p.city || '',
    country: p.country || '',
    type: p.property_type || '',
    rating: p.rating || null,
    review_count: p.review_count || null,
    photo: (Array.isArray(p.hero_photos) && p.hero_photos[0] && p.hero_photos[0].url) ? p.hero_photos[0].url : '',
    amenity_count: Array.isArray(p.amenities) ? p.amenities.length : 0,
    room_count: Array.isArray(p.rooms) ? p.rooms.length : 0
  }));

  // Inject homepage JSON (idempotent)
  try {
    const hp = await fsp.readFile(HOMEPAGE_PATH, 'utf8');
    const json = JSON.stringify(homepageListings);
    let hpOut = hp;

    // Prefer placeholder replacement if present
    if (hpOut.includes('{{__HOMEPAGE_LISTINGS_JSON__}}')) {
      hpOut = hpOut.replace('{{__HOMEPAGE_LISTINGS_JSON__}}', json);
    } else {
      // Otherwise update existing const LISTINGS assignment
      hpOut = hpOut.replace(/const\s+LISTINGS\s*=\s*[\s\S]*?;\n/i, `const LISTINGS = ${json};\n`);
    }

    await fsp.writeFile(HOMEPAGE_PATH, hpOut, 'utf8');
  } catch {
    // ignore
  }

  for (const p of properties) {
    if (!p.slug) throw new Error('Property missing slug');

    const outDir = path.join(LISTINGS_DIR, p.slug);
    await fsp.mkdir(outDir, { recursive: true });

    const meta_title = p.meta_title || `${p.name || p.slug} — Roamera`;
    const meta_description = p.meta_description || (p.tagline || `Coliving listing for ${p.name || p.slug}.`);

    // Prepare computed/template-friendly fields (handle missing data gracefully)
    const heroAll = Array.isArray(p.hero_photos) ? p.hero_photos.filter(Boolean) : [];
    const heroPhotosAll = heroAll
      .map(x => (typeof x === 'string' ? { url: x, alt: '' } : x))
      .filter(x => x && x.url);

    const commPhotos = Array.isArray(p.community_photos) ? p.community_photos.filter(Boolean) : [];
    const coworkPhotos = Array.isArray(p.coworking_photos) ? p.coworking_photos.filter(Boolean) : [];

    const roomTypes = Array.isArray(p.rooms)
      ? Array.from(new Set(p.rooms.map(r => r && r.name).filter(Boolean))).join(', ')
      : '';

    // Pricing
    const hasPrice = !!(p.price_from && String(p.price_from).trim());
    const priceFromDisplay = hasPrice ? p.price_from : '';
    const pricePeriodDisplay = hasPrice ? (p.price_period || '') : '';

    // CTA logic: booking.com > website > google maps
    const hasBookingUrl = !!(p.booking_url && String(p.booking_url).trim());
    const hasWebsite = !!(p.website && String(p.website).trim());
    const hasGooglePlacesId = !!(p.google_places_id && String(p.google_places_id).trim());
    // Show "Visit Website" as secondary when website exists (alongside booking or standalone)
    const ctaVisitWebsite = hasWebsite;
    // Show "View on Google Maps" only if no booking AND no website
    const ctaGoogleMaps = !hasBookingUrl && !hasWebsite && hasGooglePlacesId;
    // Show pricing note when no price
    const noPriceNote = !hasPrice;

    const bookingPrimaryUrl = hasBookingUrl ? String(p.booking_url).trim()
      : (hasWebsite ? String(p.website).trim() : '');

    // Build a WhatsApp "click to chat" link if we have a phone number-ish value.
    // Dataset currently has whatsapp=null everywhere, but this supports future data.
    let whatsappUrl = '';
    if (p.whatsapp && String(p.whatsapp).trim()) {
      const raw = String(p.whatsapp).trim();
      const digits = raw.replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(`Hi! I'm interested in staying at ${p.name || 'your place'} — is there availability?`);
      whatsappUrl = digits ? `https://wa.me/${digits}?text=${msg}` : raw;
    }

    const hasHighlights = !!(
      (p.beach_distance && String(p.beach_distance).trim()) ||
      (p.wifi_speed && String(p.wifi_speed).trim()) ||
      (p.unique_feature_value && String(p.unique_feature_value).trim()) ||
      (p.community_feature_value && String(p.community_feature_value).trim())
    );

    const hasReviewsSection = !!(p.rating || p.review_count || p.google_places_id);

    const propertyTypeBadge = (p.property_type === 'Hostel + Coworking')
      ? '🛏️ Hostel + Coworking'
      : '🏠 Coliving';

    const data = {
      ...p,
      meta_title,
      meta_description,
      // hero
      hero_photos_all: heroPhotosAll,
      hero_photos_grid: heroPhotosAll.slice(0, 5),
      hero_photo_count: heroPhotosAll.length,
      no_hero_photos: heroPhotosAll.length === 0,
      // photos for 2-up sections
      community_photos_2: commPhotos.slice(0, 2),
      coworking_photos_2: coworkPhotos.slice(0, 2),
      // header badge
      property_type_badge: propertyTypeBadge,
      // highlights toggle
      has_highlights: hasHighlights,
      // reviews toggle
      has_reviews_section: hasReviewsSection,
      // booking + sidebar
      booking_primary_url: bookingPrimaryUrl,
      whatsapp_url: whatsappUrl,
      room_types: roomTypes,
      has_price: hasPrice,
      price_from_display: priceFromDisplay,
      price_period_display: pricePeriodDisplay,
      cta_visit_website: ctaVisitWebsite,
      cta_google_maps: ctaGoogleMaps,
      no_price_note: noPriceNote,
      // optional policy fields (if present in data in future)
      payment: p.payment || '',
      cancellation: p.cancellation || '',
      check_in: p.check_in || '',
      check_out: p.check_out || ''
    };

    // Apply special placeholders first
    let tpl = tplRaw;
    tpl = tpl.replace('{{__INLINE_CSS__}}', inlineCss);
    tpl = tpl.replace('{{__PROPERTY_JSON__}}', JSON.stringify(p));

    // Replace ix attr placeholders with data-ix-field
    const ixMap = buildIxAttrs(p);
    for (const [k, v] of Object.entries(ixMap)) {
      tpl = tpl.replaceAll(`{{${k}}}`, v);
    }

    const html = render(tpl, data);

    const outPath = path.join(outDir, 'index.html');
    await fsp.writeFile(outPath, html, 'utf8');
    process.stdout.write(`Generated: listings/${p.slug}/index.html\n`);
  }

  // NOTE: We intentionally do NOT overwrite any generated listing with the hand-built
  // /index.html concept page. That page is the styling reference only.
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
