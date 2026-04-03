---
  JWRG Office CRM — Listings API

  Base URL: https://office.jwrgnc.com/api/v1

  No authentication required. All responses are JSON.

  ---
  List Listings

  GET /listings

  Returns a paginated list of publicly visible listings (active, coming soon, pending, under contract, sold).
  Draft/withdrawn/expired are excluded.

  Query parameters:

  ┌───────────┬─────────┬────────────────────────────────────────────────────────────────────────────┐
  │   Param   │  Type   │                                Description                                 │
  ├───────────┼─────────┼────────────────────────────────────────────────────────────────────────────┤
  │ status    │ string  │ Filter by status value: active, coming_soon, pending, under_contract, sold │
  ├───────────┼─────────┼────────────────────────────────────────────────────────────────────────────┤
  │ county    │ string  │ Filter by county name (exact match)                                        │
  ├───────────┼─────────┼────────────────────────────────────────────────────────────────────────────┤
  │ city      │ string  │ Filter by city name (exact match)                                          │
  ├───────────┼─────────┼────────────────────────────────────────────────────────────────────────────┤
  │ featured  │ boolean │ 1 to return only featured listings                                         │
  ├───────────┼─────────┼────────────────────────────────────────────────────────────────────────────┤
  │ min_price │ integer │ Minimum list price                                                         │
  ├───────────┼─────────┼────────────────────────────────────────────────────────────────────────────┤
  │ max_price │ integer │ Maximum list price                                                         │
  ├───────────┼─────────┼────────────────────────────────────────────────────────────────────────────┤
  │ per_page  │ integer │ Results per page (default 20, max 50)                                      │
  └───────────┴─────────┴────────────────────────────────────────────────────────────────────────────┘

  Response shape:

  {
    "data": [
      {
        "id": "uuid",
        "mls_number": "12345",
        "status": "active",
        "status_label": "Active",
        "featured": false,
        "property_type": "residential",
        "listing_type": "sale",
        "address": "123 Main St",
        "address_line_2": null,
        "city": "Raleigh",
        "state": "NC",
        "zip": "27601",
        "county": "Wake",
        "latitude": 35.779,
        "longitude": -78.638,
        "list_price": "450000.00",
        "original_price": "475000.00",
        "sold_price": null,
        "bedrooms": 3,
        "bathrooms_full": 2,
        "bathrooms_half": 1,
        "sqft": 2100,
        "lot_size_sqft": 10890,
        "lot_size_acres": "0.25",
        "year_built": 2005,
        "garage_spaces": 2,
        "stories": 2,
        "hoa_fee": "75.00",
        "hoa_frequency": "monthly",
        "description": "Public-facing remarks...",
        "full_description": "Internal full description...",
        "features": ["hardwood floors", "granite countertops"],
        "virtual_tour_url": null,
        "list_date": "2026-01-15",
        "sold_date": null,
        "days_on_market": 48,
        "agent": {
          "name": "Jim Wright",
          "phone": "919-555-0100"
        },
        "primary_photo": {
          "id": "uuid",
          "order": 0,
          "caption": "Front exterior",
          "is_primary": true,
          "urls": {
            "thumbnail": "https://office.jwrgnc.com/storage/...",
            "web": "https://office.jwrgnc.com/storage/...",
            "full": "https://office.jwrgnc.com/storage/...",
            "original": "https://office.jwrgnc.com/storage/..."
          }
        },
        "photo_count": 12
      }
    ],
    "links": { "first": "...", "last": "...", "prev": null, "next": "..." },
    "meta": { "current_page": 1, "last_page": 3, "per_page": 20, "total": 52 }
  }

  Note: The index response includes primary_photo and photo_count but not the full photos array — use the detail endpoint for
  that.

  ---
  Get Single Listing

  GET /listings/{id}

  Returns full listing detail including all photos.

  Response shape: Same fields as above, plus:

  {
    "data": {
      "...all index fields...",
      "photos": [
        {
          "id": "uuid",
          "order": 0,
          "caption": "Front exterior",
          "is_primary": true,
          "urls": {
            "thumbnail": "https://...",
            "web": "https://...",
            "full": "https://...",
            "original": "https://..."
          }
        }
      ]
    }
  }

  Photos are ordered by order ascending. Returns 404 if the listing is not publicly visible.

  ---
  Status values

  ┌────────────────┬────────────────┐
  │   API value    │    Meaning     │
  ├────────────────┼────────────────┤
  │ active         │ Available now  │
  ├────────────────┼────────────────┤
  │ coming_soon    │ Available soon │
  ├────────────────┼────────────────┤
  │ pending        │ Offer received │
  ├────────────────┼────────────────┤
  │ under_contract │ Under contract │
  ├────────────────┼────────────────┤
  │ sold           │ Sold           │
  └────────────────┴────────────────┘

  ---
  Image sizes

  ┌───────────┬─────────────────┐
  │    Key    │   Dimensions    │
  ├───────────┼─────────────────┤
  │ thumbnail │ 150×150         │
  ├───────────┼─────────────────┤
  │ web       │ 800×600         │
  ├───────────┼─────────────────┤
  │ full      │ 1920×1440       │
  ├───────────┼─────────────────┤
  │ original  │ Original upload │
  └───────────┴─────────────────┘
