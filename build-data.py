#!/usr/bin/env python3
"""
Merge Supabase property data + Google Places lookup into properties.json
for the static site generator.
"""
import json
import urllib.request
import time
import sys

SUPABASE_URL = "https://lfbiuekylvkymamunkyf.supabase.co/rest/v1"
SUPABASE_KEY = "sb_publishable_bkX4VIz5j0ao3memrkce2Q_Uv-5CSzP"
PLACES_FILE = "/Users/jerry/.openclaw/workspace/roamera/google-places-lookup.json"
OUTPUT_FILE = "/Users/jerry/.openclaw/workspace/waves-wifi-concept/data/properties.json"

def api_get(endpoint):
    url = f"{SUPABASE_URL}/{endpoint}"
    req = urllib.request.Request(url, headers={"apikey": SUPABASE_KEY})
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())

def main():
    print("Fetching properties...")
    props = api_get("properties?select=*&limit=100")
    print(f"Got {len(props)} properties")
    
    # Load Google Places data
    with open(PLACES_FILE) as f:
        places_list = json.load(f)
    places_map = {p['property_id']: p for p in places_list if p.get('property_id')}
    
    # Fetch related data in bulk
    print("Fetching rooms...")
    all_rooms = api_get("rooms?select=*&limit=1000")
    rooms_by_prop = {}
    for r in all_rooms:
        pid = r['property_id']
        rooms_by_prop.setdefault(pid, []).append(r)
    
    print("Fetching amenities...")
    all_pa = api_get("property_amenities?select=*,amenities(*)&limit=2000")
    amenities_by_prop = {}
    for pa in all_pa:
        pid = pa['property_id']
        amenities_by_prop.setdefault(pid, []).append(pa)
    
    print("Fetching photos...")
    all_photos = api_get("property_photos?select=*&limit=2000")
    photos_by_prop = {}
    for ph in all_photos:
        pid = ph['property_id']
        photos_by_prop.setdefault(pid, []).append(ph)
    
    print("Fetching FAQs...")
    all_faqs = api_get("faqs?select=*&limit=500")
    faqs_by_prop = {}
    for fq in all_faqs:
        pid = fq['property_id']
        faqs_by_prop.setdefault(pid, []).append(fq)
    
    # Build output
    output = []
    for p in props:
        pid = p['id']
        places = places_map.get(pid, {})
        rooms = rooms_by_prop.get(pid, [])
        amenities = amenities_by_prop.get(pid, [])
        photos = photos_by_prop.get(pid, [])
        faqs = faqs_by_prop.get(pid, [])
        
        # Use Google data to fill gaps
        rating = p.get('overall_rating') or places.get('google_rating')
        review_count = p.get('review_count') or places.get('google_review_count')
        website = p.get('website') or places.get('google_website', '')
        
        # Build hero photos from property_photos
        hero_photos = []
        for ph in sorted(photos, key=lambda x: x.get('display_order', 0)):
            if ph.get('url'):
                hero_photos.append({
                    "url": ph['url'],
                    "alt": ph.get('alt_text', f"{p['name']} photo")
                })
        
        # Build amenity list
        amenity_list = []
        for a in amenities:
            am = a.get('amenities', {})
            if am:
                amenity_list.append({
                    "icon": am.get('emoji', '✨'),
                    "name": am.get('name', '')
                })
        
        # Build room list
        room_list = []
        for r in sorted(rooms, key=lambda x: x.get('display_order', 0)):
            room_list.append({
                "name": r.get('name', 'Room'),
                "description": r.get('description', ''),
                "price": f"${r['price_monthly']}/mo" if r.get('price_monthly') else (f"${r['price_weekly']}/wk" if r.get('price_weekly') else ''),
                "photo": "",  # room photos need separate query
                "amenities": [
                    x for x in [
                        "AC" if r.get('has_private_bathroom') is not None else None,
                        "Private Bathroom" if r.get('has_private_bathroom') else None,
                        "Desk" if r.get('has_desk') else None,
                        "Balcony" if r.get('has_balcony') else None,
                        r.get('bed_size', '')
                    ] if x
                ]
            })
        
        # Build FAQ list
        faq_list = [{"question": f.get('question', ''), "answer": f.get('answer', '')} for f in faqs if f.get('question')]
        
        # Determine property type label
        ptype = p.get('property_type', 'coliving')
        type_label = 'Coliving' if ptype == 'coliving' else 'Hostel + Coworking'
        
        # Build address
        parts = [p.get('neighborhood'), p.get('city'), p.get('country')]
        address = ', '.join([x for x in parts if x])
        
        entry = {
            "slug": p.get('slug', ''),
            "name": p.get('name', ''),
            "city": p.get('city', ''),
            "country": p.get('country', ''),
            "property_type": type_label,
            "tagline": p.get('tagline', ''),
            "rating": rating,
            "review_count": review_count,
            "wifi_speed": p.get('wifi_speed', ''),
            "beach_distance": p.get('beach_distance', ''),
            "address": address or f"{p.get('city', '')}, {p.get('country', '')}",
            "latitude": float(p['latitude']) if p.get('latitude') else None,
            "longitude": float(p['longitude']) if p.get('longitude') else None,
            "email": p.get('email', ''),
            "phone": p.get('phone', ''),
            "website": website,
            "whatsapp": p.get('whatsapp', ''),
            "instagram": p.get('instagram', ''),
            "about_description": p.get('description', '') or p.get('about_us_description', ''),
            "community_description": p.get('community_description', ''),
            "coworking_description": '',  # not in DB yet
            "community_size_min": p.get('community_size_min'),
            "community_size_max": p.get('community_size_max'),
            "min_stay": f"{p.get('min_stay_value', '')} {p.get('min_stay_unit', '')}".strip() if p.get('min_stay_value') else '',
            "hero_photos": hero_photos[:5],
            "community_photos": [],  # need to source
            "coworking_photos": [],  # need to source
            "amenities": amenity_list,
            "rooms": room_list,
            "faqs": faq_list,
            "booking_url": '',  # need to find
            "unique_feature_icon": "🏊",
            "unique_feature_value": "",
            "unique_feature_label": "",
            "community_feature_icon": "🎉",
            "community_feature_value": "",
            "community_feature_label": "",
            "meta_title": p.get('meta_title', '') or f"{p['name']} — {type_label} in {p.get('city', '')}, {p.get('country', '')} | Roamera",
            "meta_description": p.get('meta_description', '') or p.get('tagline', '') or f"Discover {p['name']}, a {type_label.lower()} in {p.get('city', '')}, {p.get('country', '')}.",
            "google_places_id": places.get('google_places_id', ''),
            "status": p.get('status', 'draft'),
            "intel": {
                "name": {"source": "website", "status": "verified", "note": "From property listing"},
                "address": {"source": "google", "status": "verified" if places.get('google_address') else "unverified", "note": places.get('google_address', '')},
                "rating": {"source": "google" if places.get('google_rating') else "self", "status": "verified" if places.get('google_rating') else "unverified", "note": f"Google rating: {places.get('google_rating', 'N/A')}, {places.get('google_review_count', 0)} reviews"}
            }
        }
        
        output.append(entry)
    
    # Sort by rating (best first), then by name
    output.sort(key=lambda x: (-(x.get('rating') or 0), x.get('name', '')))
    
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\nSaved {len(output)} properties to {OUTPUT_FILE}")
    
    # Stats
    with_photos = sum(1 for p in output if p['hero_photos'])
    with_rooms = sum(1 for p in output if p['rooms'])
    with_amenities = sum(1 for p in output if p['amenities'])
    with_rating = sum(1 for p in output if p['rating'])
    with_description = sum(1 for p in output if p['about_description'])
    
    print(f"With photos: {with_photos}")
    print(f"With rooms: {with_rooms}")
    print(f"With amenities: {with_amenities}")
    print(f"With rating: {with_rating}")
    print(f"With description: {with_description}")

if __name__ == '__main__':
    main()
