# Personal Introduction — Interactive Copy

A preserved, enhanced copy of the cinematic personal site. It adds scroll-aware navigation, a mobile navigation sheet, reading progress, background-video controls, expandable profile chapters, and native profile sharing.

## Personalize

Update the name, introduction, habits, achievements, and optional email in `src/data/profile.ts`.

## Run locally

```bash
pnpm install
pnpm dev
```

Create a production build with `pnpm build`.

## Travel map and city chapters

The Travelling habit page contains a local SVG world map, country filters, city search, zoom controls, and individual city pages. The map uses public-domain Natural Earth data and needs no API key or map service. City URLs use hash routes, so direct links and refreshes work on static hosting without server rewrite rules.

The confirmed destination list contains the 20 country and region folders Liyuan supplied. Empty folders confirm destinations but do not identify cities, dates, photographs, or personal memories, so the site leaves those fields open rather than inventing them. Hong Kong, Macau, Singapore, and Monaco also function as city/locality chapters.

Add a country or region to `visitedDestinations` in `src/data/travel.ts`; one entry highlights it and creates a destination page. Use an ISO alpha-3 code when available. Tiny places absent from the simplified outlines appear as coordinate markers.

Add each confirmed city to `visitedCities`. Multiple cities can share one destination code, and every city `slug` must be unique. Do not add a city solely from a country name.

```ts
{
  slug: "your-city",
  name: "City name",
  country: "Country name",
  countryCode: "CHN",
  region: "Asia",
  coordinates: { longitude: 0, latitude: 0 }, // replace with actual coordinates
  visited: "Your travel dates", // optional
  title: "Your chapter title",
  summary: "A short introduction to your visit.",
  story: ["Your own memories and experiences."],
  moments: [{ title: "A moment to keep", detail: "What made it memorable." }],
  cover: { // optional; put your files in public/images/travel/
    src: "/images/travel/your-city.jpg",
    alt: "A description of your photograph",
    caption: "Your caption",
  },
  photos: [], // optional; same structure as cover
}
```

Published city URL: `https://adamchen.me/#/travel/your-city`. Destination overview URLs use `https://adamchen.me/#/travel/country/country-slug`. The UI retains country/search choices when returning from a page. City pages have previous/next chapter navigation, a share action, optional dates/photos, and a clear return to the map. Unknown links show a recovery page.

Run `node scripts/verify-travel.mjs` to validate the data, country grouping, and route behavior. Build output remains in `dist/`; publish it through your existing deployment process.

Map attribution: `public/data/ATTRIBUTION.md`. The generator in `scripts/generate-world-map.py` documents the projection and can regenerate the map from the original Natural Earth GeoJSON.
