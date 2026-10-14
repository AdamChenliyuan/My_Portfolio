import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, MapPin, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  cityHref,
  destinationHref,
  visitedCities,
  visitedDestinations,
  type TravelPhoto,
  type TravelRoute,
} from "@/data/travel"
import { profile } from "@/data/profile"

function CityPhoto({ photo, priority = false }: { photo: TravelPhoto; priority?: boolean }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure>
      <div className="city-photo-frame">
        {failed ? <div className="city-photo-empty"><MapPin className="size-8" aria-hidden="true" /><p>Photograph unavailable.</p></div> : <img src={photo.src} alt={photo.alt} width={1800} height={1350} loading={priority ? "eager" : "lazy"} decoding="async" onError={() => setFailed(true)} className="h-full w-full object-cover" />}
      </div>
      <figcaption className="mt-4 text-sm leading-relaxed text-muted-foreground">{photo.caption}</figcaption>
    </figure>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#travel-content" onClick={(event) => {
        event.preventDefault()
        const content = document.getElementById("travel-content")
        content?.scrollIntoView({ behavior: "instant" })
        content?.focus({ preventScroll: true })
      }}>Skip to destination</a>
      <header className="site-header fixed inset-x-0 top-0 z-40 px-3 sm:px-6">
        <nav aria-label="Destination navigation" className="nav-glass nav-glass--scrolled pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full px-5 py-3 sm:px-8 sm:py-4">
          <a href="#home" className="travel-display flex min-h-11 items-center text-xl tracking-tight hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground min-[380px]:text-2xl sm:text-3xl" aria-label={`${profile.name}, return to portfolio`}><span className="min-[380px]:hidden">{profile.compactName}</span><span className="hidden min-[380px]:inline">{profile.name}</span><sup className="ml-0.5 text-xs">&reg;</sup></a>
          <Button asChild variant="glass" className="liquid-glass min-h-11 shrink-0 rounded-full px-4 sm:px-6"><a href="#habit-travelling"><ArrowLeft className="relative z-[1]" aria-hidden="true" /><span className="relative z-[1]">Travel map</span></a></Button>
        </nav>
      </header>
      <main id="travel-content" tabIndex={-1} className="city-page mx-auto min-h-svh max-w-7xl px-6 pb-16 pt-36 text-foreground outline-none sm:pt-44 md:px-8">{children}</main>
    </>
  )
}

function useTravelPage(title: string, description?: string) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = meta?.content
    document.title = title
    if (meta && description) meta.content = description
    window.scrollTo({ top: 0, behavior: "instant" })
    headingRef.current?.focus({ preventScroll: true })
    return () => {
      document.title = previousTitle
      if (meta && previousDescription !== undefined) meta.content = previousDescription
    }
  }, [title, description])
  return headingRef
}

function DestinationPage({ slug }: { slug: string }) {
  const index = visitedDestinations.findIndex((item) => item.slug === slug)
  const destination = visitedDestinations[index]
  const headingRef = useTravelPage(destination ? `${destination.name} | ${profile.name}` : `Destination not found | ${profile.name}`, destination ? `A place on ${profile.name}’s travel map: ${destination.name}.` : undefined)
  if (!destination) return <NotFound headingRef={headingRef} noun="destination" />
  const cities = visitedCities.filter((city) => city.countryCode === destination.code)
  const previous = visitedDestinations[(index - 1 + visitedDestinations.length) % visitedDestinations.length]
  const next = visitedDestinations[(index + 1) % visitedDestinations.length]
  return (
    <>
      <nav className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground" aria-label="Breadcrumb"><a href="#home" className="travel-text-link">Portfolio</a><span aria-hidden="true">/</span><a href="#habit-travelling" className="travel-text-link">Travelling</a><span aria-hidden="true">/</span><span aria-current="page" className="text-foreground">{destination.name}</span></nav>
      <article className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <div><p className="text-sm text-muted-foreground">{destination.region}</p><h1 ref={headingRef} tabIndex={-1} className="travel-display mt-4 break-words text-6xl leading-[0.95] tracking-[-0.025em] sm:text-8xl">{destination.name}</h1><p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" aria-hidden="true" />Visited destination</p></div>
        <div className="border-t border-border pt-8 lg:pt-10"><h2 className="travel-display text-4xl leading-tight sm:text-5xl">A place on my map.</h2><p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">I’ve been to {destination.name}. The city names, travel dates, photographs, and personal notes for this destination will be added as this journal grows.</p>
          {cities.length > 0 ? <div className="mt-10"><h3 className="text-sm font-medium text-muted-foreground">City chapters</h3><ul className="mt-4 border-t border-border">{cities.map((city) => <li key={city.slug} className="border-b border-border"><a className="travel-destination-link group" href={cityHref(city)}><span className="travel-display text-3xl">{city.name}</span><ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" /></a></li>)}</ul></div> : <div className="mt-10 border-y border-border py-6"><h3 className="text-lg font-medium text-foreground">City chapters are still to come.</h3><p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">No city names were included in the destination folder, so this page stays honest and ready for your details.</p></div>}
        </div>
      </article>
      <TravelPager previousHref={destinationHref(previous)} previousLabel={previous.name} nextHref={destinationHref(next)} nextLabel={next.name} label="destination" />
    </>
  )
}

function CityChapter({ slug }: { slug: string }) {
  const index = visitedCities.findIndex((item) => item.slug === slug)
  const city = visitedCities[index]
  const headingRef = useTravelPage(city ? `${city.name} | ${profile.name}` : `City not found | ${profile.name}`, city?.summary)
  const [shareStatus, setShareStatus] = useState("")
  if (!city) return <NotFound headingRef={headingRef} noun="city chapter" />
  const destination = visitedDestinations.find((item) => item.code === city.countryCode)
  const previous = visitedCities[(index - 1 + visitedCities.length) % visitedCities.length]
  const next = visitedCities[(index + 1) % visitedCities.length]
  async function shareCity() {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href })
        setShareStatus("City chapter shared.")
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        setShareStatus("City link copied.")
      } else throw new Error()
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      setShareStatus("Copy the page address from your browser to share this chapter.")
    }
  }
  return (
    <>
      <nav className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground" aria-label="Breadcrumb"><a href="#home" className="travel-text-link">Portfolio</a><span aria-hidden="true">/</span><a href="#habit-travelling" className="travel-text-link">Travelling</a>{destination && <><span aria-hidden="true">/</span><a href={destinationHref(destination)} className="travel-text-link">{destination.name}</a></>}<span aria-hidden="true">/</span><span aria-current="page" className="text-foreground">{city.name}</span></nav>
      <article>
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="min-w-0 lg:sticky lg:top-36"><h1 ref={headingRef} tabIndex={-1} className="travel-display break-words text-7xl leading-[0.95] tracking-[-0.025em] sm:text-8xl">{city.name}</h1><p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" aria-hidden="true" />{city.country} / {city.region}</p><h2 className="travel-display mt-10 max-w-md text-4xl leading-tight sm:text-5xl">{city.title}</h2><p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">{city.summary}</p><Button variant="glass" onClick={shareCity} className="liquid-glass mt-8 min-h-11 cursor-pointer rounded-full px-6"><Share2 className="relative z-[1]" aria-hidden="true" /><span className="relative z-[1]">Share this city</span></Button><p role="status" aria-live="polite" className="mt-3 min-h-5 max-w-sm text-sm text-muted-foreground">{shareStatus}</p></div>
          <div className="min-w-0">{city.cover ? <CityPhoto photo={city.cover} priority /> : <div className="city-photo-frame"><div className="city-photo-empty"><MapPin className="size-8" aria-hidden="true" /><p>Personal photographs and notes will be added here.</p></div></div>}</div>
        </div>
        {city.story.length > 0 && <section className="mt-20 grid gap-8 border-t border-border pt-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16"><h2 className="travel-display text-4xl sm:text-5xl">Notes from a place.</h2><div className="max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{city.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>}
      </article>
      {visitedCities.length > 1 && <TravelPager previousHref={cityHref(previous)} previousLabel={previous.name} nextHref={cityHref(next)} nextLabel={next.name} label="city" />}
    </>
  )
}

function TravelPager({ previousHref, previousLabel, nextHref, nextLabel, label }: { previousHref: string; previousLabel: string; nextHref: string; nextLabel: string; label: string }) {
  return <nav aria-label={`Other ${label} pages`} className="mt-20 grid grid-cols-2 gap-8 border-y border-border py-8"><a href={previousHref} className="travel-chapter-link group"><span className="flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Previous {label}</span><span className="travel-display mt-3 block text-2xl sm:text-4xl">{previousLabel}</span></a><a href={nextHref} className="travel-chapter-link group text-right"><span className="flex items-center justify-end gap-2 text-sm text-muted-foreground">Next {label}<ArrowRight className="size-4" aria-hidden="true" /></span><span className="travel-display mt-3 block text-2xl sm:text-4xl">{nextLabel}</span></a></nav>
}

function NotFound({ headingRef, noun }: { headingRef: React.RefObject<HTMLHeadingElement>; noun: string }) {
  return <div className="py-16 sm:py-24"><h1 ref={headingRef} tabIndex={-1} className="travel-display max-w-3xl text-5xl leading-none sm:text-7xl">This {noun} isn’t here yet.</h1><p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">The link may be incomplete. Return to the travel map to explore the available destinations.</p><Button asChild variant="glass" className="liquid-glass mt-10 min-h-12 rounded-full px-8"><a href="#habit-travelling"><ArrowLeft className="relative z-[1]" aria-hidden="true" /><span className="relative z-[1]">Return to the travel map</span></a></Button></div>
}

export default function CityPage({ route }: { route: TravelRoute }) {
  return <PageShell>{route.kind === "country" ? <DestinationPage slug={route.slug} /> : <CityChapter slug={route.slug} />}</PageShell>
}
