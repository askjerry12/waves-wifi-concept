# Browse & Search — Section Spec

## Overview
Search results page with filterable card grid. The main browsing experience after search or city selection.

## Route
`/results` (should be public — no login required)

## Page Background
gray-50 (#fafaf9) — same as listing pages.

## Layout
```
┌────────────────────────────────────────┐
│ Top Bar                                │
├──────────┬─────────────────────────────┤
│ Filters  │  Results Header             │
│ (280px)  │  (sort + count + map toggle)│
│          ├─────────────────────────────┤
│          │  Card Grid                  │
│          │  3 cols desktop             │
│          │  2 cols tablet              │
│          │  1 col mobile               │
├──────────┴─────────────────────────────┤
│ Footer                                 │
└────────────────────────────────────────┘
```

## Filter Sidebar (Desktop) / Drawer (Mobile)
- Width: 280px fixed left
- Sections separated by 1px gray-200 dividers
- Each filter:
  - Label: DM Sans 0.85rem weight 600
  - Control: checkbox, slider, or dropdown
- Filters:
  - City / Country (dropdown with search)
  - Price range (slider, min-max)
  - WiFi speed minimum (slider)
  - Amenities (checkboxes: Coworking, Pool, Kitchen, Gym, etc.)
  - Stay length (pills: Weekly, Monthly, 3+ Months)
  - Rating minimum (star selector)
- "Clear all" link at bottom
- Mobile: Sheet/drawer, triggered by filter icon button with active count badge

## Results Header
- Left: "X spaces found" in DM Sans 0.9rem gray-500
- Right: Sort dropdown (Featured, Price ↑↓, Rating, Newest) + Map toggle button

## Card Grid
- Grid: 3 columns desktop, 2 tablet, 1 mobile, gap 1rem
- Card pattern (from concept):
  - Image: aspect 4:3, object-fit cover, rounded-lg top
  - Hover: scale(1.02), shadow elevation
  - Content: name (DM Sans bold), location (gray-500 + pin icon), rating stars, price
  - Tags: "Featured" (coral), "Superhost" (sage)
  - Favorite heart button: top-right of image

## Empty State
- "No colivings match your filters"
- Illustration + "Try adjusting your filters" text
- "Clear all filters" CTA

## Map View (Future)
- Toggle splits view: left cards, right map
- Map pins for each visible listing
- Pin click → mini preview card
- Cards highlight on map pin hover

## Data Sources
- Supabase: properties (published only), property_photos (primary), rooms (min price)
- Client-side filtering after initial load
