# Listing Page — Section Spec

## Overview
The single coliving detail page. The most important page on Roamera — this is where nomads decide whether to book. Must answer "What's the vibe like?" comprehensively.

## Reference
`index.html` — the canonical listing page design.
Live: https://roamera-concept.vercel.app

## Route
`/property/:slug`

## Page Sections (exact order, top to bottom)

### 1. Breadcrumb
- Pattern: Home > Mexico > Playa del Carmen > [Property Name]
- Font: 0.8rem gray-400, links in gray-500
- Max-width 1200px, padding 1rem 2rem 0.5rem

### 2. Photo Gallery
- Grid: 2fr 1fr 1fr columns × 2 rows, 0.5rem gap
- Height: 600px desktop, 400px tablet, single image mobile
- First image spans both rows (hero shot)
- All images: object-fit cover, hover scale(1.02)
- "View all X photos" button: absolute bottom-right corner
- Click any image → fullscreen lightbox
- Container: border-radius 1.25rem, overflow hidden

### 3. Section Nav
- Horizontal tabs below gallery
- Items: Overview · Rooms · Coworking · Amenities · Community · Reviews · Location · FAQ
- Active state: coral text + 2px bottom border
- Scroll-to-section on click

### 4. Two-Column Layout
Left column (content) + Right column (380px booking card)
Desktop: side-by-side. Mobile: booking card moves to top.

---

## LEFT COLUMN SECTIONS

### 4a. Header
- Property name: h1, Playfair 2.2rem weight 600
- Location: icon + "Playa del Carmen, Mexico" — 1rem gray-500
- Tags: pill badges (sage for general, coral for special)
  - Examples: "🏄 Surf Spot", "⚡ 200 Mbps WiFi", "🌴 Beachfront", "🔥 Popular"
- Border-bottom gray-200, padding-bottom 1.75rem

### 4b. Quick Highlights
- 4-column grid of stats
- Each: emoji icon (1.5rem) + uppercase label (0.72rem gray-500) + value (0.9rem bold)
- Stats: WiFi Speed, Community Size, Min Stay, Monthly From
- Border-bottom gray-200

### 4c. About (Overview)
- 2-3 paragraphs of property description
- 0.95rem gray-600, line-height 1.6
- Optional "Show more" toggle for long descriptions

### 4d. Rooms
- Horizontal scroll of room cards (snap scrolling)
- Each card: 280-300px wide, fixed
  - Image: 180px height with price badge (charcoal pill, top-right)
  - Title: DM Sans 0.95rem bold
  - Description: 0.8rem gray-500
  - Amenity pills below (gray-100 bg, 0.68rem)
- Thin scrollbar (4px gray-300)

### 4e. Coworking & Workspace
- 3-column feature grid (gray-100 bg cards with icon + label)
- Features: Monitor Setups, Phone Booths, Podcast Studio, etc.
- Pricing cards: flex row, border gray-200, hover border coral
  - Period: uppercase 0.72rem gray-500
  - Price: Playfair 1.6rem bold
  - Note: 0.7rem gray-400

### 4f. Amenities
- 2-column grid (1 column mobile)
- Each: 28px emoji icon + 0.9rem gray-600 text
- Show 8-12 by default
- "Show all X amenities" button: charcoal border, 0.85rem bold

### 4g. Community & Vibe
- 2-column photo grid (community/social photos, 260px height)
- Description paragraphs
- Community tags: cream bg, gray-200 border, pill shape
  - Examples: "🎯 Skill Shares", "🌮 Taco Tuesdays", "🧘 Morning Yoga"

### 4h. Reviews
- Header: Playfair 2rem score + star icons (#F4A261) + count
- Review cards: gray-100 bg, radius 0.75rem, padding 1.25rem
  - Avatar (40×40 circle) + name (0.85rem bold) + date (0.72rem gray-400)
  - Stars in #F4A261
  - Blockquote: 0.9rem gray-600 italic
- "Load more reviews" button: full-width, white bg, gray-300 border
- Show 3 reviews by default, hidden class on rest

### 4i. Sustainability
- 2-column grid
- Each: sage-light bg, radius 0.75rem, padding 0.75rem
- Emoji icon + bold title + description (0.82rem gray-700)

### 4j. Location
- Map container: radius 0.75rem, 250px height
- Location details: 2-column grid (1 column mobile)
- Each: 0.85rem gray-600 with icon

### 4k. FAQ
- Accordion pattern
- Question: 0.9rem weight 600, flex with "+" toggle
- "+" icon: coral, rotates 45° on open
- Answer: 0.85rem gray-600, slide down (max-height 0→200px, 0.35s)
- Items separated by 1px gray-200 border

---

## RIGHT COLUMN

### 4l. Booking Card (Sticky Sidebar)
- Sticky: top 80px (desktop), relative top (mobile)
- White bg, gray-200 border, radius 1.25rem, padding 1.75rem
- Shadow: 0 4px 24px rgba(0,0,0,.06)
- Price line: "From" + Playfair 2rem price + "/month"
- Rating: stars + score + review count
- Primary CTA: coral full-width button, 1rem weight 700
- Secondary: transparent, gray-300 border, 0.85rem weight 600
- Divider + details list (check-in, WiFi, kitchen, etc.)
- Host section: border-top, avatar circle (sage bg) + name + "Superhost" badge

---

## Interactions
- Photo click → lightbox (full gallery)
- Section nav click → smooth scroll to section
- FAQ click → accordion toggle
- "Show all amenities" → expanded view
- "Load more reviews" → show hidden review cards
- Room card horizontal scroll with snap
- Booking CTA → external booking link or inquiry form

## Data Required
- Property (all fields)
- Rooms (for this property)
- Photos (ordered by display_order)
- Amenities (via property_amenities join)
- Reviews (for this property, with author info)
- Nearby Places (for location section)
