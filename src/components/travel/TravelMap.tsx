import { useEffect, useId, useMemo, useRef, useState } from "react"
import { LoaderCircle, Minus, Plus, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cityHref, type TravelCity, type TravelDestination } from "@/data/travel"

type CountryShape = { code: string; name: string; d: string }

let cachedShapes: CountryShape[] | null = null

type TravelMapProps = {
  destinations: readonly TravelDestination[]
  cities: readonly TravelCity[]
  selectedCountry: string
  onSelectCountry: (code: string) => void
}

const MAP_WIDTH = 1000
const MAP_HEIGHT = 420
const MAX_ZOOM = 4

function project(longitude: number, latitude: number) {
  return {
    x: ((longitude + 180) * MAP_WIDTH) / 360,
    y: ((85 - latitude) * MAP_HEIGHT) / 145,
  }
}

export default function TravelMap({ destinations, cities, selectedCountry, onSelectCountry }: TravelMapProps) {
  const frameRef = useRef<HTMLElement>(null)
  const instructionsId = useId()
  const titleId = useId()
  const [requested, setRequested] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [shapes, setShapes] = useState<CountryShape[] | null>(() => cachedShapes)
  const [failed, setFailed] = useState(false)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const countries = useMemo(() => destinations.map((destination) => ({
    code: destination.code,
    name: destination.name,
    coordinates: destination.coordinates,
    cities: cities.filter((city) => city.countryCode === destination.code),
  })), [destinations, cities])
  const countryLookup = useMemo(() => new Map(countries.map((country) => [country.code, country])), [countries])
  const missingCountries = useMemo(() => {
    if (!shapes) return []
    const represented = new Set(shapes.map((shape) => shape.code))
    return countries.filter((country) => !represented.has(country.code))
  }, [countries, shapes])
  const selected = countryLookup.get(selectedCountry)
  const selectedCities = selected?.cities ?? []
  const focusCity = selectedCities[0]
  const focusCoordinates = focusCity?.coordinates ?? selected?.coordinates
  const focus = focusCoordinates
    ? project(focusCoordinates.longitude, focusCoordinates.latitude)
    : { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 }
  const width = MAP_WIDTH / zoom
  const height = MAP_HEIGHT / zoom
  const left = Math.max(0, Math.min(MAP_WIDTH - width, focus.x - width / 2))
  const top = Math.max(0, Math.min(MAP_HEIGHT - height, focus.y - height / 2))
  const mapLabel = "World travel map"
  const statusText = selected
    ? selectedCities.length > 0
      ? `${selected.name} · ${selectedCities.length} city ${selectedCities.length === 1 ? "chapter" : "chapters"}`
      : `${selected.name} · city chapters to come`
    : destinations.length > 0
      ? "Select a highlighted destination to explore."
      : "A map for the places you have been."

  useEffect(() => {
    if (cachedShapes) return
    const frame = frameRef.current
    if (!frame) return
    if (!("IntersectionObserver" in window)) {
      setRequested(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRequested(true)
          observer.disconnect()
        }
      },
      { rootMargin: "400px" },
    )
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!requested) return
    if (cachedShapes) {
      setShapes(cachedShapes)
      return
    }
    const controller = new AbortController()
    setFailed(false)
    fetch(`${import.meta.env.BASE_URL}data/world-countries.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Map data could not be loaded")
        return response.json() as Promise<unknown>
      })
      .then((data) => {
        if (
          !Array.isArray(data) ||
          data.length === 0 ||
          !data.every((shape) =>
            shape && typeof shape.code === "string" && typeof shape.name === "string" && typeof shape.d === "string",
          )
        ) throw new Error("Map data is incomplete")
        if (!controller.signal.aborted) {
          cachedShapes = data as CountryShape[]
          setShapes(cachedShapes)
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true)
      })
    return () => controller.abort()
  }, [requested, attempt])

  return (
    <figure ref={frameRef} className="travel-map-frame" aria-label={mapLabel}>
      <div className="travel-map-toolbar">
        <p className="min-w-0 text-sm text-foreground/80" aria-hidden="true">
          {hoveredCountry ?? statusText}
        </p>
        <div className="travel-map-controls" role="group" aria-label="Map zoom controls">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Zoom out on map"
            disabled={!shapes || zoom <= 1}
            onClick={() => setZoom((value) => Math.max(1, value / 1.5))}
          >
            <Minus aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Zoom in on map"
            disabled={!shapes || zoom >= MAX_ZOOM}
            onClick={() => setZoom((value) => Math.min(MAX_ZOOM, value * 1.5))}
          >
            <Plus aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Reset map zoom"
            disabled={!shapes || zoom === 1}
            onClick={() => setZoom(1)}
          >
            <RotateCcw aria-hidden="true" />
          </Button>
        </div>
      </div>

      <p id={instructionsId} className="sr-only">
        Visited countries and regions are highlighted.{" "}
        Select a highlighted destination with the mouse, or use Tab then Enter or Space, to filter the list below.
        The country filters and city links below the map provide the same navigation.
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{statusText}</p>

      <div className="travel-map-stage" style={{ aspectRatio: "1000 / 420" }}>
        {shapes ? (
          <svg
            className="travel-map-svg"
            viewBox={`${left} ${top} ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
            role="group"
            aria-labelledby={titleId}
            aria-describedby={instructionsId}
          >
            <title id={titleId}>{mapLabel}</title>
            {shapes.map((shape) => {
              const country = countryLookup.get(shape.code)
              const isSelected = Boolean(country && selectedCountry === shape.code)
              return (
                <path
                  key={shape.code}
                  d={shape.d}
                  fillRule="evenodd"
                  vectorEffect="non-scaling-stroke"
                  className={`travel-map-country${country ? " travel-map-country--visited" : ""}${isSelected ? " travel-map-country--selected" : ""}`}
                  role={country ? "button" : undefined}
                  tabIndex={country ? 0 : undefined}
                  aria-label={country ? `Explore ${country.name}` : undefined}
                  aria-pressed={country ? isSelected : undefined}
                  aria-hidden={country ? undefined : true}
                  onPointerEnter={() => setHoveredCountry(shape.name)}
                  onPointerLeave={() => setHoveredCountry(null)}
                  onFocus={() => setHoveredCountry(shape.name)}
                  onBlur={() => setHoveredCountry(null)}
                  onClick={() => country && onSelectCountry(shape.code)}
                  onKeyDown={(event) => {
                    if (country && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault()
                      onSelectCountry(shape.code)
                    }
                  }}
                >
                  <title>{shape.name}</title>
                </path>
              )
            })}
            {missingCountries.map((country) => {
              const point = project(country.coordinates.longitude, country.coordinates.latitude)
              const isSelected = selectedCountry === country.code
              return (
                <g
                  key={country.code}
                  className={`travel-map-country-pin${isSelected ? " travel-map-country-pin--selected" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Explore ${country.name}`}
                  aria-pressed={isSelected}
                  onPointerEnter={() => setHoveredCountry(country.name)}
                  onPointerLeave={() => setHoveredCountry(null)}
                  onFocus={() => setHoveredCountry(country.name)}
                  onBlur={() => setHoveredCountry(null)}
                  onClick={() => onSelectCountry(country.code)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      onSelectCountry(country.code)
                    }
                  }}
                >
                  <title>{country.name}</title>
                  <circle className="travel-map-country-pin-target" cx={point.x} cy={point.y} r={13 / zoom} fill="transparent" />
                  <circle
                    className="travel-map-country-pin-dot"
                    cx={point.x}
                    cy={point.y}
                    r={6 / zoom}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              )
            })}
            {selectedCities.map((city) => {
              const point = project(city.coordinates.longitude, city.coordinates.latitude)
              return (
                <a
                  key={city.slug}
                  href={cityHref(city)}
                  className="travel-map-marker"
                  aria-label={`Open ${city.name} city page`}
                >
                  <title>{city.name}</title>
                  <circle cx={point.x} cy={point.y} r={13 / zoom} fill="transparent" />
                  <circle
                    className="travel-map-marker-dot"
                    cx={point.x}
                    cy={point.y}
                    r={4.5 / zoom}
                    vectorEffect="non-scaling-stroke"
                  />
                </a>
              )
            })}
          </svg>
        ) : (
          <div className="travel-map-status" role="status">
            {failed ? (
              <>
                <p className="text-sm text-foreground/80">The map could not load. You can still explore the destinations below.</p>
                <Button type="button" variant="outline" size="sm" onClick={() => setAttempt((value) => value + 1)}>
                  Retry map
                </Button>
              </>
            ) : (
              <>
                <LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                <p className="text-sm text-foreground/70">Loading world map…</p>
              </>
            )}
          </div>
        )}
      </div>

      <figcaption className="travel-map-caption">
        <div className="travel-map-legend">
          <span className="inline-flex items-center gap-2">
            <span className="travel-map-swatch travel-map-swatch--visited" aria-hidden="true" />
            Visited countries & regions
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="travel-map-swatch" aria-hidden="true" />
            Other countries
          </span>
        </div>
        <a
          href="https://www.naturalearthdata.com/about/terms-of-use/"
          target="_blank"
          rel="noopener noreferrer"
          className="travel-map-credit underline underline-offset-4 hover:text-foreground"
        >
          Map: Natural Earth · public domain
        </a>
      </figcaption>
    </figure>
  )
}
