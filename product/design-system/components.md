# Roamera — Component Patterns

> Extracted from the Waves & WiFi concept pages. These are the CANONICAL component specs. Any LLM building Roamera UI must follow these exactly.

## Top Bar (Navigation)
```
Height: 64px
Background: white
Border: 1px solid gray-200
Position: sticky top:0 z:100
Padding: 0 2rem

Left: Logo — "Roamera" in Playfair Display 1.4rem weight 700 + coral dot (10×10 circle)
Center: Search — pill-shaped (2rem radius), gray-100 bg, gray-200 border, gray-500 text, 0.85rem
Right: Nav links (0.85rem weight 500 gray-600) + Avatar circle (36×36, coral bg, white initial)

Mobile: hide nav links, keep logo + avatar
```

## Photo Gallery
```
Layout: CSS Grid — 2fr 1fr 1fr columns, 2 rows, 0.5rem gap
Height: 600px (desktop), 400px (tablet), auto (mobile)
First image: spans 2 rows (hero image)
Border-radius: radius-xl (1.25rem) on container (overflow: hidden)
Hover: scale(1.02) on individual images, 0.3s transition
"View all photos" button: absolute bottom-right, white bg, gray-300 border, 0.8rem weight 600

Tablet: 2 columns (hide images 4+)
Mobile: single image only
```

## Section Nav (Scrollspy)
```
Max-width: 1200px, below gallery
Border-bottom: 1px solid gray-200
Horizontal scroll on overflow
Links: 0.82rem weight 600, gray-500, padding 0.85rem 1.1rem
Active/hover: coral text + coral 2px bottom border
Items: Overview, Rooms, Coworking, Amenities, Community, Reviews, Location, FAQ
```

## Quick Highlights (Stats Bar)
```
Layout: 4-column grid (desktop), 2-column (mobile)
Each: centered, padding 1rem 0.5rem
Icon: 1.5rem emoji
Label: 0.72rem uppercase weight 600 gray-500 (letter-spacing 0.05em)
Value: 0.9rem weight 700 charcoal
Separated by border-bottom gray-200
```

## Section Block
```
Pattern: padding-bottom 2rem + border-bottom 1px gray-200 + margin-bottom 2rem
Last section: no border
Title: Playfair Display 1.5rem weight 600, margin-bottom 0.75rem
Body text: 0.95rem gray-600, line-height 1.6
Subsection h3: DM Sans 1.1rem weight 700, margin-bottom 0.5rem
```

## Tag
```
Display: inline-flex, align center, gap 0.3rem
Background: sage-light (#e8f4ee), Color: sage (#81B29A)
Padding: 0.3rem 0.75rem
Border-radius: 2rem (pill)
Font: 0.75rem weight 600
Variant "coral": bg #fdf0ec, color coral (#E07A5F)
```

## Pill (smaller than tag)
```
Background: gray-100, Color: gray-600
Padding: 0.2rem 0.55rem
Border-radius: 2rem
Font: 0.68rem weight 500
```

## Room Card
```
Width: 280-300px (fixed in horizontal scroll)
Background: white
Border: 1px solid gray-200
Border-radius: radius-lg (1rem)
Overflow: hidden
Hover: shadow 0 4px 20px rgba(0,0,0,.08)

Image: 180px height, object-fit cover, hover scale(1.04) 0.4s transition
Price badge: absolute top-right, charcoal bg, white text, pill shape, 0.78rem weight 700
Card body: padding 1rem
Title: DM Sans 0.95rem weight 700
Description: 0.8rem gray-500
Amenity pills below description

Scroll container: horizontal flex, gap 1rem, scroll-snap-type x mandatory
Thin scrollbar: 4px height, gray-300 thumb
```

## Review Card
```
Background: gray-100 (#f5f5f4)
Border-radius: radius (0.75rem)
Padding: 1.25rem

Header: flex, gap 0.75rem
  Avatar: 40×40 circle, object-fit cover, gray-200 fallback
  Name: 0.85rem weight 700 charcoal
  Date: 0.72rem gray-400
  Stars: #F4A261 color, 0.8rem

Content: blockquote, 0.9rem gray-600, italic, line-height 1.5

Load More: full-width button, white bg, gray-300 border, 0.9rem weight 600
```

## Booking Card (Sidebar CTA)
```
Position: sticky top 80px (desktop), relative (mobile)
Background: white
Border: 1px solid gray-200
Border-radius: radius-xl (1.25rem)
Padding: 1.75rem
Shadow: 0 4px 24px rgba(0,0,0,.06)

Price: "From" 0.85rem gray-500 + Playfair 2rem weight 700 + "/month" 0.85rem gray-500
Rating: 0.85rem gray-500 with stars in #F4A261

Primary button: coral bg, white text, radius 0.75rem, 1rem weight 700, full-width
Secondary button: transparent bg, charcoal text, gray-300 border, 0.85rem weight 600

Divider: 1px gray-200, margin 1.25rem 0
Details list: 0.82rem gray-500, icon + text rows
Host section: border-top, flex, 44×44 sage-green avatar circle, name + "Superhost" label
```

## Community Tags
```
Background: cream (#FAF3E0)
Border: 1px solid gray-200
Border-radius: 2rem
Padding: 0.35rem 0.85rem
Font: 0.78rem weight 500
Display: flex with emoji icon + text
```

## Amenity Row
```
Display: 2-column grid (desktop), 1-column (mobile), gap 0.6rem
Each: flex, gap 0.6rem, padding 0.4rem 0
Icon: 28px wide, centered, 1.1rem emoji
Text: 0.9rem gray-600
"Show all" button: border 1px charcoal, radius 0.75rem, 0.85rem weight 600, hover gray-100 bg
```

## Cowork Feature Card
```
Layout: 3-column grid (desktop), 2-column (mobile)
Background: gray-100
Border-radius: radius (0.75rem)
Padding: 0.85rem, text-align center
Icon: 1.3rem, margin-bottom 0.3rem
Label: 0.78rem weight 600 charcoal
```

## Cowork Pricing Card
```
Layout: flex row (desktop), column (mobile)
Each: flex-1, border 1px gray-200, radius 0.75rem, padding 1rem, text-align center
Hover: border-color coral
Period label: 0.72rem uppercase gray-500 weight 600
Price: Playfair 1.6rem weight 700
Note: 0.7rem gray-400
```

## FAQ Accordion
```
Each item: border-bottom 1px gray-200, padding 0.85rem 0
Question: DM Sans 0.9rem weight 600, flex space-between
Toggle icon: "+" in coral 1.3rem, rotates 45° when open
Answer: 0.85rem gray-600, max-height 0 → 200px transition 0.35s
```

## Lightbox
```
Background: rgba(0,0,0,.92) full-screen fixed
Close: top-right, white text 2rem, opacity 0.7 → 1 hover
Nav arrows: 48×48 circle, white/15% bg + backdrop-blur, border white/20%
Image: max 90vw × 80vh, object-fit contain, radius 0.5rem, shadow
Caption: white/80%, 0.85rem, centered
Counter: top-left, white/60%, 0.85rem weight 600
Thumbnails: flex row, 60×40 images, opacity 0.4 → 1 active, coral outline on active
```

## Footer
```
Background: charcoal (#2D3436)
Text: white/60% opacity
Padding: 2.5rem 2rem
Logo: Playfair 1.25rem white
Links: 0.82rem white/50%, hover coral-light
Layout: flex space-between, wrap on mobile
```

## Buttons Summary
| Type | Background | Text | Border | Radius | Size |
|------|-----------|------|--------|--------|------|
| Primary CTA | coral | white | none | 0.75rem | 1rem w700 |
| Secondary | transparent | charcoal | 1px gray-300 | 0.75rem | 0.85rem w600 |
| Show More | transparent | charcoal | 1px charcoal | 0.75rem | 0.85rem w600 |
| Load More | white | charcoal | 1px gray-300 | 0.75rem | 0.9rem w600 |
| Gallery btn | white | charcoal | 1px gray-300 | 0.75rem | 0.8rem w600 |

## Animations
```
fade-in: opacity 0→1, translateY 20px→0, 0.5s ease
Image hover: scale 1→1.02 (gallery) or 1→1.04 (cards), 0.3-0.4s
Button hover: background color transition 0.2s
Link hover: color transition 0.2s
FAQ toggle: max-height 0→200px, 0.35s ease
Lightbox nav arrow rotate: transform 45deg on open
```

## DO NOT
- Use cool/blue grays — all grays are warm (stone family)
- Use pure black (#000) — use charcoal (#2D3436)
- Put Playfair Display on buttons, labels, nav, or body text
- Put DM Sans on h1 or h2 headings (h3 subsections are the exception)
- Use sharp corners on cards — minimum radius is 0.75rem
- Use heavy box shadows — keep them subtle (max 0.08 opacity)
- Use colored backgrounds on cards — cards are always white with gray-200 border
- Skip hover states — every interactive element needs a hover transition
- Use placeholder/Lorem ipsum text — always use realistic coliving content
