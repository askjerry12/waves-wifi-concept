#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Waves & Wifi data
const wavesWifiData = {
  name: "Waves & Wifi",
  slug: "waves-wifi-las-salinas-nicaragua",
  city: "Las Salinas",
  country: "Nicaragua",
  meta_title: "Waves & Wifi — Coliving + Coworking in Las Salinas, Nicaragua",
  meta_description: "Beachfront coliving with reliable WiFi, community dinners, and surf breaks right outside. Perfect for digital nomads.",
  hero_photos: [
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80",
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80"
  ],
  rating: 4.9,
  review_count: 105,
  google_places_id: "ChIJJXMGtPYvdI8RloGjH4jx7lc",
  about_description: "At Waves & Wifi in Las Salinas, we wake up to the sound of waves and start our days with sunrise yoga on the beach. The space is designed for remote workers who want to balance productivity with surf, sand, and community. Our high-speed WiFi reaches every corner of the property, so you can take video calls from the hammocks or work at the shared tables overlooking the ocean.",
  community_description: "Evenings here are about connection. We gather for family-style dinners cooked by our local chef, share stories around the fire pit, and plan weekend surf trips to nearby breaks. The community is a mix of freelancers, startup founders, and creatives—all here to work remotely while living the beach life.",
  distance_to_thing: "50m to beach",
  wifi_speed: "200 Mbps",
  unique_feature: "Sunset rooftop",
  community_feature: "Family dinners",
  property_type: "coliving",
  community_size_min: 8,
  community_size_max: 20,
  min_stay: 7,
  price: null,
  booking_url: null,
  website: "https://wavesandwifi.com",
  whatsapp: null,
  rooms: [
    {
      name: "Ocean View Private",
      description: "King bed, private bathroom, balcony facing the sea",
      price: 85,
      amenities: ["AC", "Private Bathroom", "Balcony", "Ocean View"]
    },
    {
      name: "Garden Bungalow",
      description: "Queen bed, shared bathroom, steps from the beach",
      price: 65,
      amenities: ["Fan", "Shared Bathroom", "Garden Access"]
    },
    {
      name: "Dorm Bed",
      description: "Comfortable bunk in 4-person shared room",
      price: 35,
      amenities: ["Fan", "Lockers", "Shared Bathroom"]
    }
  ],
  amenities: ["wifi", "coworking", "kitchen", "ac", "laundry", "bike-rental", "surfboards", "yoga-deck", "bbq", "garden"],
  faqs: [
    { q: "What's the WiFi speed?", a: "200 Mbps symmetrical fiber—fast enough for video calls and large uploads." },
    { q: "Is there a kitchen?", a: "Yes, fully equipped shared kitchen with fridge, stove, oven, and all utensils." },
    { q: "How far is the nearest surf break?", a: "The main break is 50m from our gate. Beginner-friendly waves too." },
    { q: "What's included in the price?", a: "Accommodation, WiFi, weekly cleaning, yoga classes, and community dinners." }
  ]
};

// Helper function to render template
function renderTemplate(data, filename) {
  let html = template;
  
  // Replace all placeholders
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`;
    if (html.includes(placeholder)) {
      html = html.replaceAll(placeholder, value || '');
    }
  }
  
  // Handle special cases
  html = html.replace('{{__INLINE_CSS__}}', '');
  html = html.replace('{{__PROPERTY_JSON__}}', JSON.stringify(data));
  
  // Handle conditional blocks
  html = html.replace(/{{#if booking_url}}[\s\S]*?{{\/if}}/g, (match) => {
    if (data.booking_url) {
      return match.replace(/{{#if booking_url}}/, '').replace(/{{\/if}}/, '');
    }
    return '';
  });
  
  html = html.replace(/{{#if cta_visit_website}}[\s\S]*?{{\/if}}/g, (match) => {
    if (data.website) {
      return match.replace(/{{#if cta_visit_website}}/, '').replace(/{{\/if}}/, '');
    }
    return '';
  });
  
  // Write to file
  fs.writeFileSync(path.join(__dirname, filename), html);
  console.log(`Created: ${filename}`);
}

// Create 3 variations

// 1. Current version (no booking link)
const version1 = { ...wavesWifiData };
version1.booking_url = null;
version1.cta_visit_website = true;
version1.cta_google_maps = true;
renderTemplate(version1, 'waves-wifi-current.html');

// 2. Booking.com version
const version2 = { ...wavesWifiData };
version2.booking_url = 'https://www.booking.com/hotel/ni/waves-wifi.html';
version2.cta_visit_website = true;
version2.cta_google_maps = true;
renderTemplate(version2, 'waves-wifi-booking.html');

// 3. HostelWorld version  
const version3 = { ...wavesWifiData };
version3.booking_url = 'https://www.hostelworld.com/hosteldetails.php/Waves-Wifi/Las-Salinas/123456';
version3.cta_visit_website = true;
version3.cta_google_maps = true;
// Change button text for HostelWorld
let template3 = template.replace('Check Availability on Booking.com', 'Check Availability on HostelWorld');
fs.writeFileSync(path.join(__dirname, 'template-hostelworld.html'), template3);
renderTemplate(version3, 'waves-wifi-hostelworld.html');

console.log('\n✅ Created 3 template variations:');
console.log('1. waves-wifi-current.html — No booking link (current)');
console.log('2. waves-wifi-booking.html — Booking.com link');
console.log('3. waves-wifi-hostelworld.html — HostelWorld link');