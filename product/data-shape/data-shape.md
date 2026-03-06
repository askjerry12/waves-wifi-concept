# Roamera — Data Shape

## Core Entities (Supabase)

### Property
A coliving space listing — the central entity.
- Has many: Rooms, Amenities (via join), Photos, Reviews, Nearby Places
- Belongs to: Profile (owner/host)
- Key fields: name, slug, city, country, description, latitude, longitude, status (draft/published), featured, superhost
- **89 rows in production**

### Room
A room type within a property.
- Belongs to: Property
- Fields: name, description, price_monthly, price_weekly, capacity, currency
- **80 rows — pricing data needs fixing**

### Amenity
A feature/perk (WiFi, Pool, Coworking, etc.).
- Many-to-many with Property via `property_amenities`
- Fields: name, category, icon
- Categories: workspace, living, kitchen, social, fitness, outdoor, safety
- **~200 amenities, ~500 links**

### Property Photo
- Belongs to: Property
- Fields: url, alt_text, display_order, is_primary
- Supabase Storage bucket
- **900+ photos**

### Review
- Belongs to: Property, Profile
- Fields: rating (1-5), content, stay_start, stay_end, verified, helpful_count
- **~50 rows — needs real data**

### Nearby Place
- Belongs to: Property (from Google Places API)
- Fields: name, type, distance, rating, google_place_id

### Profile
User account.
- Has many: Properties (if host), Reviews
- Fields: email, display_name, avatar_url, role (user/host/admin)

## Relationships
```
Profile 1──∞ Property
Property 1──∞ Room
Property ∞──∞ Amenity (via property_amenities)
Property 1──∞ Property Photo
Property 1──∞ Review
Property 1──∞ Nearby Place
Profile 1──∞ Review
```
