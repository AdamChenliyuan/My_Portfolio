import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  MapPinned,
  Share2,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import TravelJournal, { type TravelViewState } from "@/components/travel/TravelJournal"
import { habitHref, type HabitRoute } from "@/data/routes"
import { profile } from "@/data/profile"

const habitIcons = {
  badminton: Zap,
  photography: Camera,
  travelling: MapPinned,
} as const

function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        className="skip-link"
        href="#habit-content"
        onClick={(event) => {
          event.preventDefault()
          const content = document.getElementById("habit-content")
          content?.scrollIntoView({ behavior: "instant" })
          content?.focus({ preventScroll: true })
        }}
      >
        Skip to habit
      </a>
      <header className="site-header fixed inset-x-0 top-0 z-40 px-3 sm:px-6">
        <nav
          aria-label="Habit navigation"
          className="nav-glass nav-glass--scrolled pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full px-5 py-3 sm:px-8 sm:py-4"
        >
          <a
            href="#home"
            className="travel-display flex min-h-11 items-center text-xl tracking-tight hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground min-[380px]:text-2xl sm:text-3xl"
            aria-label={`${profile.name}, return to portfolio`}
          >
            <span className="min-[380px]:hidden">{profile.compactName}</span>
            <span className="hidden min-[380px]:inline">{profile.name}</span>
            <sup className="ml-0.5 text-xs">&reg;</sup>
          </a>
          <Button asChild variant="glass" className="liquid-glass min-h-11 rounded-full px-4 sm:px-6">
            <a href="#habits">
              <ArrowLeft className="relative z-[1]" aria-hidden="true" />
              <span className="relative z-[1]">All habits</span>
            </a>
          </Button>
        </nav>
      </header>
      <main
        id="habit-content"
        tabIndex={-1}
        className="habit-detail-page mx-auto min-h-svh max-w-7xl px-6 pb-16 pt-36 text-foreground outline-none sm:pt-44 md:px-8"
      >
        {children}
      </main>
    </>
  )
}

function useHabitPage(title: string, description: string, headingRef: React.RefObject<HTMLHeadingElement>) {
  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = meta?.content
    document.title = title
    if (meta) meta.content = description
    window.scrollTo({ top: 0, behavior: "instant" })
    headingRef.current?.focus({ preventScroll: true })
    return () => {
      document.title = previousTitle
      if (meta && previousDescription !== undefined) meta.content = previousDescription
    }
  }, [description, headingRef, title])
}

function HabitMedia({ habit }: { habit: (typeof profile.habits)[number] }) {
  if (habit.media.length === 0) return null

  return (
    <section className="mt-20 border-t border-border pt-10" aria-labelledby="habit-media-title">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
            The record
          </p>
          <h2
            id="habit-media-title"
            className="travel-display mt-4 text-4xl leading-none sm:text-5xl"
          >
            Moments I keep.
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">{habit.media.length} images</p>
      </div>

      <div
        className="habit-media mt-10 grid gap-6 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] md:items-end"
        aria-label={`${habit.name} photographs and certificate`}
      >
        {habit.media.map((media, mediaIndex) => (
          <figure
            key={media.src}
            className={mediaIndex === 1 ? "group md:mb-10" : media.featured ? "group md:col-span-2" : "group"}
          >
            <div
              className={
                `overflow-hidden border border-border bg-foreground/[0.03] ${
                  media.featured
                    ? "aspect-[138/100]"
                    : mediaIndex === 0
                      ? "aspect-[3/4]"
                      : "aspect-[16/9]"
                }`
              }
            >
              <img
                src={media.src}
                alt={media.alt}
                width={media.width}
                height={media.height}
                loading="lazy"
                decoding="async"
                className={`h-full w-full transition-transform duration-700 ease-out ${
                  media.featured ? "object-contain p-2 sm:p-4" : "object-cover group-hover:scale-[1.02]"
                }`}
              />
            </div>
            <figcaption className="mt-3 flex gap-4 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
              <span className="shrink-0 text-xs tabular-nums text-foreground/60">
                {String(mediaIndex + 1).padStart(2, "0")}
              </span>
              <span>{media.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function HabitPager({
  previous,
  next,
}: {
  previous: (typeof profile.habits)[number]
  next: (typeof profile.habits)[number]
}) {
  return (
    <nav aria-label="Other habit pages" className="mt-20 grid grid-cols-2 gap-8 border-y border-border py-8">
      <a href={habitHref(previous.id)} className="travel-chapter-link group">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Previous habit
        </span>
        <span className="travel-display mt-3 block text-2xl sm:text-4xl">{previous.name}</span>
      </a>
      <a href={habitHref(next.id)} className="travel-chapter-link group text-right">
        <span className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
          Next habit
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
        <span className="travel-display mt-3 block text-2xl sm:text-4xl">{next.name}</span>
      </a>
    </nav>
  )
}

function NotFound({ headingRef }: { headingRef: React.RefObject<HTMLHeadingElement> }) {
  return (
    <div className="py-16 sm:py-24">
      <h1 ref={headingRef} tabIndex={-1} className="travel-display max-w-3xl text-5xl leading-none sm:text-7xl">
        This habit isn’t here yet.
      </h1>
      <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
        The link may be incomplete. Return to the habits index to choose another chapter.
      </p>
      <Button asChild variant="glass" className="liquid-glass mt-10 min-h-12 rounded-full px-8">
        <a href="#habits">
          <ArrowLeft className="relative z-[1]" aria-hidden="true" />
          <span className="relative z-[1]">Return to habits</span>
        </a>
      </Button>
    </div>
  )
}

type HabitPageProps = {
  route: HabitRoute
  travelView: TravelViewState
  onTravelViewChange: (view: TravelViewState) => void
}

export default function HabitPage({
  route,
  travelView,
  onTravelViewChange,
}: HabitPageProps) {
  const index = profile.habits.findIndex((item) => item.id === route.slug)
  const habit = profile.habits[index]
  const headingRef = useRef<HTMLHeadingElement>(null)
  useHabitPage(
    habit ? `${habit.name} | ${profile.name}` : `Habit not found | ${profile.name}`,
    habit ? `${habit.name}, one of ${profile.name}’s personal chapters.` : "",
    headingRef,
  )
  const [shareStatus, setShareStatus] = useState("")

  if (!habit) return <PageShell><NotFound headingRef={headingRef} /></PageShell>

  const HabitIcon = habitIcons[habit.id]
  const previous = profile.habits[(index - 1 + profile.habits.length) % profile.habits.length]
  const next = profile.habits[(index + 1) % profile.habits.length]

  async function shareHabit() {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href })
        setShareStatus("Habit chapter shared.")
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        setShareStatus("Habit link copied.")
      } else throw new Error()
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      setShareStatus("Copy the page address from your browser to share this chapter.")
    }
  }

  return (
    <PageShell>
      <nav className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <a href="#home" className="travel-text-link">Portfolio</a>
        <span aria-hidden="true">/</span>
        <a href="#habits" className="travel-text-link">Habits</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-foreground">{habit.name}</span>
      </nav>

      <article>
        <div className="grid items-start gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div className="min-w-0 lg:sticky lg:top-36">
            <div className="habit-glyph" aria-hidden="true"><HabitIcon /></div>
            <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {habit.index} / {habit.label}
            </p>
            <h1 ref={headingRef} tabIndex={-1} className="travel-display mt-5 break-words text-7xl leading-[0.92] outline-none sm:text-8xl">
              {habit.name}
            </h1>
            <p className="mt-8 max-w-md text-2xl leading-tight text-foreground sm:text-3xl">{habit.title}</p>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">{habit.detail}</p>
            <Button type="button" variant="glass" onClick={shareHabit} className="liquid-glass mt-8 min-h-11 cursor-pointer rounded-full px-6">
              <Share2 className="relative z-[1]" aria-hidden="true" />
              <span className="relative z-[1]">Share this chapter</span>
            </Button>
            <p role="status" aria-live="polite" className="mt-3 min-h-5 max-w-sm text-sm text-muted-foreground">{shareStatus}</p>
          </div>

          <div className="min-w-0">
            <section className="border-t border-border pt-8 lg:pt-10" aria-labelledby="habit-note-title">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">A closer look</p>
              <h2 id="habit-note-title" className="travel-display mt-4 max-w-2xl text-4xl leading-tight sm:text-5xl">
                The practice behind the habit.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{habit.note}</p>
            </section>

            <HabitMedia habit={habit} />
          </div>
        </div>

        {habit.id === "travelling" && (
          <TravelJournal view={travelView} onViewChange={onTravelViewChange} />
        )}
      </article>

      <HabitPager previous={previous} next={next} />
    </PageShell>
  )
}
