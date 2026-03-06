# Roamera — Application Shell

## Layout Structure
```
┌──────────────────────────────────────────┐
│ Top Bar (sticky, white, 64px)            │
├──────────────────────────────────────────┤
│ Section Nav (listing pages only)         │
├──────────────────────────────────────────┤
│                                          │
│   Page Content (max-width 1200px)        │
│                                          │
├──────────────────────────────────────────┤
│ Footer (charcoal bg)                     │
└──────────────────────────────────────────┘
```

## Top Bar
- **Height:** 64px
- **Background:** white (#fff)
- **Border:** bottom 1px solid gray-200
- **Position:** sticky top:0 z-index:100
- **Padding:** 0 2rem (desktop), 0 1rem (mobile)

### Logo (left)
- Text: "Roamera" in Playfair Display, 1.4rem, weight 700, charcoal
- Coral dot: 10×10px circle (#E07A5F) to the left of text
- Links to homepage

### Search Bar (center — desktop only)
- Pill-shaped: border-radius 2rem
- Background: gray-100, border 1px gray-200
- Text: 0.85rem gray-500 placeholder
- Hover: border gray-300
- On homepage: hidden (hero has search)

### Navigation (center-right — desktop only)
- Links: 0.85rem weight 500, gray-600, hover coral
- Items: Browse, Blog, List Your Space
- Hidden on mobile (< 768px)

### User Menu (right)
- **Logged out:** "Sign Up" text link
- **Logged in:** 36×36 circle, coral background, white initial letter
- Click → dropdown menu

## Section Nav (Listing Pages Only)
- Appears below gallery, above listing content
- Horizontal scrollable tabs
- Links: 0.82rem weight 600 gray-500
- Active: coral text + 2px coral bottom border
- Items: Overview · Rooms · Coworking · Amenities · Community · Reviews · Location · FAQ
- Max-width: 1200px centered
- Border-bottom: 1px solid gray-200

## Content Area
- Max-width: 1200px, centered
- Padding: 2rem (desktop), 1.25rem (mobile)
- Listing pages: 2-column grid (content + 380px sidebar) with 3rem gap
- Other pages: single column

## Footer
- Background: charcoal (#2D3436)
- Padding: 2.5rem 2rem
- Max-width: 1200px inner
- Logo: Playfair 1.25rem white
- Links: 0.82rem white/50% opacity, hover coral
- Layout: flex space-between, wrap on mobile

## Responsive Behavior
| Breakpoint | Top Bar | Layout | Gallery |
|-----------|---------|--------|---------|
| > 1024px | Full nav + search + avatar | 2-col listing | 3-col gallery (600px) |
| 768–1024px | Logo + avatar only | Single column, booking card on top | 2-col gallery (400px) |
| < 768px | Logo + avatar | Single column | 2-col gallery, hide images 4+ |
| < 480px | Logo + avatar | Single column | Single image |
