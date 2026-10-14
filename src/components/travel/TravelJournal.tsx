import { ArrowUpRight, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import TravelMap from "@/components/travel/TravelMap"
import { cityHref, destinationHref, visitedDestinations, visitedCities } from "@/data/travel"
import { cn } from "@/lib/utils"

export type TravelViewState = { country: string; query: string; mode: "destinations" | "cities" }

type TravelJournalProps = {
  view: TravelViewState
  onViewChange: (view: TravelViewState) => void
}

export default function TravelJournal({ view, onViewChange }: TravelJournalProps) {
  const query = view.query.trim().toLocaleLowerCase()
  const selected = visitedDestinations.find((place) => place.code === view.country)
  const regions = ["Asia", "Europe", "Europe & Asia", "Africa"] as const
  const visiblePlaces = visitedDestinations.filter((place) =>
    (view.country === "all" || place.code === view.country) &&
    `${place.name} ${place.region}`.toLocaleLowerCase().includes(query),
  )
  const visibleCities = visitedCities.filter((city) =>
    (view.country === "all" || city.countryCode === view.country) &&
    `${city.name} ${city.country} ${city.region}`.toLocaleLowerCase().includes(query),
  )
  const count = view.mode === "destinations" ? visiblePlaces.length : visibleCities.length
  const selectCountry = (country: string) => onViewChange({ ...view, country, query: "" })

  return (
    <section className="travel-journal mt-16" aria-labelledby="travel-journal-title">
      <div className="flex flex-wrap items-end justify-between gap-6 border-t border-border pt-8">
        <div>
          <h4 id="travel-journal-title" className="travel-display text-4xl leading-none sm:text-5xl">Places & perspectives.</h4>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            The places I’ve been, and the stories still taking shape.
          </p>
        </div>
        <p className="text-sm tabular-nums text-muted-foreground"><span className="text-foreground">{visitedDestinations.length}</span> countries & regions</p>
      </div>

      <TravelMap destinations={visitedDestinations} cities={visitedCities} selectedCountry={view.country} onSelectCountry={selectCountry} />

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 sm:max-w-[17rem]">
          <label htmlFor="travel-country" className="mb-2 block text-sm text-muted-foreground">Explore a destination</label>
          <select id="travel-country" value={view.country} onChange={(event) => selectCountry(event.target.value)} className="travel-select">
            <option value="all">All countries & regions</option>
            {regions.map((region) => (
              <optgroup key={region} label={region}>
                {visitedDestinations.filter((place) => place.region === region).map((place) => <option key={place.code} value={place.code}>{place.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="w-full sm:max-w-[17rem]">
          <label htmlFor="travel-search" className="mb-2 block text-sm text-muted-foreground">Find a place</label>
          <div className="travel-search">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input id="travel-search" type="search" value={view.query} onChange={(event) => onViewChange({ ...view, country: "all", query: event.target.value })} placeholder="City, country or region" autoComplete="off" className="min-w-0 flex-1 bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground" />
            {view.query && <button type="button" aria-label="Clear place search" className="travel-clear" onClick={() => onViewChange({ ...view, query: "" })}><X className="size-4" aria-hidden="true" /></button>}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Travel directory view">
        <button type="button" aria-pressed={view.mode === "destinations"} onClick={() => onViewChange({ ...view, mode: "destinations" })} className={cn("travel-filter", view.mode === "destinations" && "travel-filter--active")}>Destinations<span className="ml-2 tabular-nums opacity-70">{visitedDestinations.length}</span></button>
        <button type="button" aria-pressed={view.mode === "cities"} onClick={() => onViewChange({ ...view, mode: "cities" })} className={cn("travel-filter", view.mode === "cities" && "travel-filter--active")}>City chapters<span className="ml-2 tabular-nums opacity-70">{visitedCities.length}</span></button>
        {(view.country !== "all" || view.query) && <Button type="button" variant="ghost" className="min-h-11 cursor-pointer rounded-full text-muted-foreground hover:bg-foreground/5 hover:text-foreground" onClick={() => onViewChange({ ...view, country: "all", query: "" })}>Clear filters<X className="size-4" aria-hidden="true" /></Button>}
      </div>

      <p className="mt-7 text-sm text-muted-foreground" role="status" aria-live="polite" aria-atomic="true">
        {count} {view.mode === "destinations" ? (count === 1 ? "destination" : "destinations") : (count === 1 ? "city chapter" : "city chapters")}
        {selected && ` in ${selected.name}`}{query && ` matching “${view.query.trim()}”`}
      </p>

      {view.mode === "destinations" ? (
        <ul className="travel-destination-list mt-4 border-t border-border" aria-label="Visited countries and regions">
          {visiblePlaces.map((place) => {
            const cityCount = visitedCities.filter((city) => city.countryCode === place.code).length
            return (
              <li key={place.code}>
                <a href={destinationHref(place)} className="travel-destination-link group">
                  <div className="min-w-0"><h5 className="travel-display text-3xl leading-tight sm:text-4xl">{place.name}</h5><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{place.region} / {cityCount > 0 ? `${cityCount} ${cityCount === 1 ? "city chapter" : "city chapters"}` : "City chapters to come"}</p></div>
                  <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ul>
      ) : (
        <ul className="mt-4 border-t border-border" aria-label="City pages">
          {visibleCities.map((city) => (
            <li key={city.slug} className="border-b border-border">
              <a href={cityHref(city)} className="travel-city-link group">
                <div className="min-w-0"><span className="text-sm text-muted-foreground">{city.country}{city.visited && ` / ${city.visited}`}</span><h5 className="travel-display mt-2 text-4xl text-foreground sm:text-5xl">{city.name}</h5><p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">{city.summary}</p><span className="mt-5 inline-flex items-center gap-2 text-sm text-foreground">Open the city chapter<ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></span></div>
                {city.cover && <img src={city.cover.src} alt="" loading="lazy" decoding="async" width={320} height={240} className="travel-city-thumb" />}
              </a>
            </li>
          ))}
        </ul>
      )}

      {count === 0 && (
        <div className="border-b border-border py-10">
          <h5 className="travel-display text-3xl">{view.mode === "cities" && selected && !query ? "City chapters are still to come." : "No places in this view."}</h5>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">{view.mode === "cities" && selected && !query ? "This destination is on my map. Its city names, photographs, and personal stories will be added next." : "Try another place, or clear the filters to see all destinations."}</p>
          {selected && view.mode === "cities" && !query ? <Button asChild variant="glass" className="liquid-glass mt-6 rounded-full px-5"><a href={destinationHref(selected)}><span className="relative z-[1]">Explore {selected.name}</span><ArrowUpRight className="relative z-[1]" aria-hidden="true" /></a></Button> : <Button variant="glass" className="liquid-glass mt-6 cursor-pointer rounded-full px-5" onClick={() => onViewChange({ ...view, country: "all", query: "" })}>Clear filters</Button>}
        </div>
      )}
    </section>
  )
}
