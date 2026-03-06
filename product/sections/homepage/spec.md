# Homepage — Section Spec

## Overview
The discovery entry point. Hero with search, featured destinations, trending spaces, and social proof. Sets the warm, adventurous tone for the entire platform.

## Reference
`homepage.html` — the canonical homepage design.
Live: https://roamera-concept.vercel.app/homepage.html

## Route
`/`

## Page Background
Sand (#FDF6EC) — warm off-white, NOT the gray-50 used on listing pages.

## Page Sections (top to bottom)

### 1. Top Bar
- Same as shell spec but logo color is CORAL on homepage (not charcoal)
- Nav links: gray-600 on white topbar
- No search bar in topbar (hero has the search)

### 2. Hero
- Full-width, 80vh height (min 600, max 800)
- Background: beach/tropical image, brightness(0.55) filter
- Content centered, max-width 700px
- Title: Playfair 3.5rem weight 600, white, text-shadow
  - Italic accent word in #FFD6A5 (warm gold): "Find Your *Vibe*"
- Subtitle: 1.15rem white/88%, weight 400
- Search bar: pill-shaped, white/translucent bg, centered below subtitle

### 3. Search Bar (in hero)
- Pill shape: border-radius 24px
- Background: #f8f9fa (near-white)
- Fields: destination input + date range + search button
- Search button: coral bg, white text, pill-shaped
- Max-width: 80% of hero content

### 4. Featured Cities
- Horizontal scroll of city cards
- Each card: image with dark overlay, city name in white bold, property count
- Rounded corners (radius-lg)
- Click → city guide or filtered search

### 5. Featured / Trending Spaces
- 3-column card grid (desktop)
- Standard ColivingCard pattern (photo + name + location + price + rating)
- "View All" link

### 6. How It Works
- 3-step horizontal layout
- Each: icon/illustration + title + description
- Steps: Discover → Compare → Book

### 7. Community / Social Proof
- Testimonial quotes from nomads
- Partner logos or trust signals
- Newsletter signup CTA

### 8. Footer
- Standard footer (charcoal bg, see shell spec)

## Mobile Behavior
- Hero: reduced height, smaller title (2.5rem)
- City cards: horizontal scroll
- Space cards: single column stack
- How It Works: vertical stack
