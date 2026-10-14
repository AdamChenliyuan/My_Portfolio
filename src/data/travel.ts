export type TravelPhoto = {
  src: string
  alt: string
  caption: string
  credit?: { label: string; href: string }
}

export type TravelCity = {
  slug: string
  name: string
  country: string
  /** Natural Earth / ISO 3166-1 alpha-3 code, e.g. JPN, FRA, HKG. */
  countryCode: string
  region: string
  coordinates: { longitude: number; latitude: number }
  visited?: string
  title: string
  summary: string
  story: readonly string[]
  moments: readonly { title: string; detail: string }[]
  cover?: TravelPhoto
  photos?: readonly TravelPhoto[]
}

export type TravelDestination = {
  slug: string
  name: string
  code: string
  region: string
  /** Approximate geographical centre for map placement, not a city visit. */
  coordinates: { longitude: number; latitude: number }
}

/**
 * Confirmed destinations supplied by Liyuan.
 * The 20 folders identify countries and regions; they contain no city lists,
 * photographs, dates, or personal accounts. Folder spelling is normalised for
 * Denmark (Danmark), Morocco (Moroco), and Switzerland (Switzeland).
 * Regional visits are represented directly; mainland China is not inferred.
 */
export const visitedDestinations: readonly TravelDestination[] = [
  { slug: "denmark", name: "Denmark", code: "DNK", region: "Europe", coordinates: { longitude: 9.5, latitude: 56 } },
  { slug: "finland", name: "Finland", code: "FIN", region: "Europe", coordinates: { longitude: 26, latitude: 64 } },
  { slug: "france", name: "France", code: "FRA", region: "Europe", coordinates: { longitude: 2.5, latitude: 46.5 } },
  { slug: "germany", name: "Germany", code: "DEU", region: "Europe", coordinates: { longitude: 10.5, latitude: 51 } },
  { slug: "hong-kong", name: "Hong Kong, China", code: "HKG", region: "Asia", coordinates: { longitude: 114.17, latitude: 22.32 } },
  { slug: "italy", name: "Italy", code: "ITA", region: "Europe", coordinates: { longitude: 12.5, latitude: 42.5 } },
  { slug: "japan", name: "Japan", code: "JPN", region: "Asia", coordinates: { longitude: 138, latitude: 37 } },
  { slug: "macau", name: "Macau, China", code: "MAC", region: "Asia", coordinates: { longitude: 113.55, latitude: 22.2 } },
  { slug: "monaco", name: "Monaco", code: "MCO", region: "Europe", coordinates: { longitude: 7.42, latitude: 43.74 } },
  { slug: "morocco", name: "Morocco", code: "MAR", region: "Africa", coordinates: { longitude: -6, latitude: 32 } },
  { slug: "norway", name: "Norway", code: "NOR", region: "Europe", coordinates: { longitude: 9, latitude: 62 } },
  { slug: "poland", name: "Poland", code: "POL", region: "Europe", coordinates: { longitude: 19, latitude: 52 } },
  { slug: "russia", name: "Russia", code: "RUS", region: "Europe & Asia", coordinates: { longitude: 100, latitude: 60 } },
  { slug: "singapore", name: "Singapore", code: "SGP", region: "Asia", coordinates: { longitude: 103.82, latitude: 1.35 } },
  { slug: "south-korea", name: "South Korea", code: "KOR", region: "Asia", coordinates: { longitude: 127.8, latitude: 36.5 } },
  { slug: "spain", name: "Spain", code: "ESP", region: "Europe", coordinates: { longitude: -3.5, latitude: 40 } },
  { slug: "sweden", name: "Sweden", code: "SWE", region: "Europe", coordinates: { longitude: 15, latitude: 62 } },
  { slug: "switzerland", name: "Switzerland", code: "CHE", region: "Europe", coordinates: { longitude: 8.2, latitude: 46.8 } },
  { slug: "taiwan", name: "Taiwan, China", code: "TWN", region: "Asia", coordinates: { longitude: 121, latitude: 23.7 } },
  { slug: "united-kingdom", name: "United Kingdom", code: "GBR", region: "Europe", coordinates: { longitude: -2.5, latitude: 54.5 } },
]

/** These four supplied destinations also identify a city or local chapter. */
export const visitedCities: readonly TravelCity[] = [
  {
    slug: "hong-kong",
    name: "Hong Kong",
    country: "Hong Kong, China",
    countryCode: "HKG",
    region: "Asia",
    coordinates: { longitude: 114.17, latitude: 22.32 },
    title: "A chapter in Hong Kong.",
    summary: "A chapter from my travels in Hong Kong. Photographs and notes will be added here.",
    story: [],
    moments: [],
  },
  {
    slug: "macau",
    name: "Macau",
    country: "Macau, China",
    countryCode: "MAC",
    region: "Asia",
    coordinates: { longitude: 113.55, latitude: 22.2 },
    title: "A chapter in Macau.",
    summary: "A chapter from my travels in Macau. Photographs and notes will be added here.",
    story: [],
    moments: [],
  },
  {
    slug: "singapore",
    name: "Singapore",
    country: "Singapore",
    countryCode: "SGP",
    region: "Asia",
    coordinates: { longitude: 103.82, latitude: 1.35 },
    title: "A chapter in Singapore.",
    summary: "A chapter from my travels in Singapore. Photographs and notes will be added here.",
    story: [],
    moments: [],
  },
  {
    slug: "monaco",
    name: "Monaco",
    country: "Monaco",
    countryCode: "MCO",
    region: "Europe",
    coordinates: { longitude: 7.42, latitude: 43.74 },
    title: "A chapter in Monaco.",
    summary: "A chapter from my travels in Monaco. Photographs and notes will be added here.",
    story: [],
    moments: [],
  },
]

export type TravelRoute = { slug: string; kind: "city" | "country" }

export function parseTravelRoute(hash: string): TravelRoute | null {
  if (!hash.startsWith("#/travel/")) return null
  const kind = hash.startsWith("#/travel/country/") ? "country" : "city"
  const prefix = kind === "country" ? "#/travel/country/" : "#/travel/"
  const match = /^([^/?]+)(?:\?.*)?$/.exec(hash.slice(prefix.length))
  if (!match) return { slug: "", kind }
  try {
    return { slug: decodeURIComponent(match[1]), kind }
  } catch {
    return { slug: "", kind }
  }
}

export function cityHref(city: Pick<TravelCity, "slug">) {
  return `#/travel/${encodeURIComponent(city.slug)}`
}

export function destinationHref(place: Pick<TravelDestination, "slug">) {
  return `#/travel/country/${encodeURIComponent(place.slug)}`
}

export function getCountries(cities: readonly TravelCity[]) {
  const countries = new Map<string, { code: string; name: string; cities: TravelCity[] }>()
  for (const city of cities) {
    const country = countries.get(city.countryCode)
    if (country) country.cities.push(city)
    else countries.set(city.countryCode, { code: city.countryCode, name: city.country, cities: [city] })
  }
  return [...countries.values()].sort((a, b) => a.name.localeCompare(b.name))
}
