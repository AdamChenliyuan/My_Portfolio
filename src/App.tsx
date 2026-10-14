import {
  type MouseEvent,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Camera,
  MapPinned,
  Menu,
  Pause,
  Play,
  Plus,
  Share2,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import TravelJournal, { type TravelViewState } from "@/components/travel/TravelJournal"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { profile } from "@/data/profile"
import { parseTravelRoute } from "@/data/travel"
import { useJourneyProgress } from "@/hooks/use-journey-progress"
import { cn } from "@/lib/utils"

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"

const navItems = [
  { id: "home", label: "Home", href: "#home" },
  { id: "about", label: "About", href: "#about" },
  { id: "habits", label: "Habits", href: "#habits" },
  { id: "achievements", label: "Achievements", href: "#achievements" },
  { id: "contact", label: "Share", href: "#contact" },
] as const

const sectionIds = navItems.map((item) => item.id)

const habitIcons = {
  badminton: Zap,
  photography: Camera,
  travelling: MapPinned,
} as const

const CityPage = lazy(() => import("@/pages/CityPage"))

function Portfolio({ travelView, onTravelViewChange }: {
  travelView: TravelViewState
  onTravelViewChange: (view: TravelViewState) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playbackPreferenceRef = useRef(true)
  const hasPlaybackPreferenceRef = useRef(false)
  const shareTimerRef = useRef<number | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [shareStatus, setShareStatus] = useState("")
  const { activeSection, isScrolled, progress } = useJourneyProgress(sectionIds)

  useEffect(() => {
    document.title = `${profile.name} | ${profile.role}`

    const video = videoRef.current
    const hero = document.getElementById("home")
    if (!video || !hero) return

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
    let heroIsVisible = true
    let storedPreference: string | null = null

    try {
      storedPreference = window.sessionStorage.getItem("liyuan-video-playback")
    } catch {
      storedPreference = null
    }

    hasPlaybackPreferenceRef.current = storedPreference !== null
    playbackPreferenceRef.current = storedPreference
      ? storedPreference === "playing"
      : !motionPreference.matches

    const applyPlaybackPreference = () => {
      if (
        playbackPreferenceRef.current &&
        heroIsVisible &&
        !document.hidden &&
        !videoFailed
      ) {
        void video.play().catch(() => setIsVideoPlaying(false))
      } else {
        video.pause()
      }
    }

    const handleMotionPreference = () => {
      if (!hasPlaybackPreferenceRef.current) {
        playbackPreferenceRef.current = !motionPreference.matches
      }
      applyPlaybackPreference()
    }

    const handleVisibility = () => applyPlaybackPreference()
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroIsVisible = entry.isIntersecting
        applyPlaybackPreference()
      },
      { threshold: 0.08 },
    )

    heroObserver.observe(hero)
    motionPreference.addEventListener("change", handleMotionPreference)
    document.addEventListener("visibilitychange", handleVisibility)
    applyPlaybackPreference()

    return () => {
      heroObserver.disconnect()
      motionPreference.removeEventListener("change", handleMotionPreference)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [videoFailed])

  useEffect(
    () => () => {
      if (shareTimerRef.current) window.clearTimeout(shareTimerRef.current)
    },
    [],
  )

  const handleAnchorClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute("href")
    if (!href?.startsWith("#")) return

    const target = document.getElementById(href.slice(1))
    if (!target) return

    event.preventDefault()
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const heading = target.querySelector<HTMLElement>("h1, h2, h3")

    window.history.pushState(null, "", href)
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    })

    if (heading) {
      heading.tabIndex = -1
      window.requestAnimationFrame(() => heading.focus({ preventScroll: true }))
    }
  }, [])

  const toggleVideoPlayback = () => {
    const video = videoRef.current
    if (!video || videoFailed) return

    const shouldPlay = video.paused
    playbackPreferenceRef.current = shouldPlay
    hasPlaybackPreferenceRef.current = true

    try {
      window.sessionStorage.setItem(
        "liyuan-video-playback",
        shouldPlay ? "playing" : "paused",
      )
    } catch {
      // Playback still works when session storage is unavailable.
    }

    if (shouldPlay) {
      void video.play().catch(() => setIsVideoPlaying(false))
    } else {
      video.pause()
    }
  }

  const shareProfile = async () => {
    const shareData = {
      title: `${profile.name} | ${profile.role}`,
      text: `Explore the personal journey of ${profile.name}.`,
      url: window.location.href.split("#")[0],
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        setShareStatus("Profile shared.")
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url)
        setShareStatus("Profile link copied.")
      } else {
        throw new Error("Clipboard unavailable")
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      setShareStatus("Sharing is unavailable. Copy the URL from your browser.")
    }

    if (shareTimerRef.current) window.clearTimeout(shareTimerRef.current)
    shareTimerRef.current = window.setTimeout(() => setShareStatus(""), 4000)
  }

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to profile
      </a>

      <div
        className="reading-progress"
        role="progressbar"
        aria-label="Page reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <header className="site-header fixed inset-x-0 top-0 z-40 px-3 sm:px-6">
        <nav
          aria-label="Primary navigation"
          className={cn(
            "nav-glass pointer-events-auto mx-auto flex max-w-7xl flex-row items-center justify-between gap-4 rounded-full px-5 py-3 sm:px-8 sm:py-4",
            isScrolled && "nav-glass--scrolled",
          )}
        >
          <a
            href="#home"
            aria-label={profile.name}
            onClick={handleAnchorClick}
            className="flex min-h-11 shrink-0 items-center text-xl tracking-tight text-foreground outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-foreground min-[380px]:text-2xl sm:text-3xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            <span className="min-[380px]:hidden">{profile.compactName}</span>
            <span className="hidden min-[380px]:inline">{profile.name}</span>
            <sup className="ml-0.5 text-xs">&reg;</sup>
          </a>

          <div className="hidden items-center gap-5 md:flex lg:gap-7">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={handleAnchorClick}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative flex min-h-11 items-center px-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
                    isActive && "text-foreground",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "nav-active-marker",
                      isActive && "nav-active-marker--visible",
                    )}
                  />
                </a>
              )
            })}
          </div>

          <Button
            asChild
            variant="glass"
            className="liquid-glass hidden h-11 shrink-0 cursor-pointer rounded-full px-6 text-sm text-foreground active:scale-[0.98] md:inline-flex"
          >
            <a href="#about" onClick={handleAnchorClick}>
              <span className="relative z-[1]">Begin Journey</span>
              <ArrowDown className="relative z-[1]" aria-hidden="true" />
            </a>
          </Button>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="glass"
                size="icon"
                className="liquid-glass shrink-0 cursor-pointer rounded-full text-foreground active:scale-[0.96] md:hidden"
                aria-label="Open journey navigation"
              >
                <Menu className="relative z-[1]" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="pr-14">
                <SheetTitle>{profile.name}</SheetTitle>
                <SheetDescription>{profile.role}</SheetDescription>
              </SheetHeader>

              <nav className="mt-14 border-t border-border" aria-label="Mobile navigation">
                {navItems.map((item, index) => {
                  const isActive = activeSection === item.id
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(event) => {
                        setIsMenuOpen(false)
                        handleAnchorClick(event)
                      }}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "sheet-nav-link group flex min-h-16 items-center gap-5 border-b border-border text-muted-foreground",
                        isActive && "text-foreground",
                      )}
                    >
                      <span className="w-8 text-sm tabular-nums text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-xl">{item.label}</span>
                      <ArrowUpRight
                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </header>

      <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <section
          id="home"
          aria-labelledby="hero-title"
          className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-background"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
            onError={() => setVideoFailed(true)}
            className="video-cinematic absolute inset-0 z-0 h-full w-full object-cover"
          >
            <source src={VIDEO_URL} type="video/mp4" />
            Your browser does not support background video.
          </video>

          <div
            className="hero-nav-spacer h-[88px] shrink-0 sm:h-[108px]"
            aria-hidden="true"
          />

          <div className="hero-content relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-10 text-center sm:py-[90px]">
            <h1
              id="hero-title"
              className="hero-title animate-fade-rise max-w-7xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-foreground sm:text-7xl md:text-8xl"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              I make{" "}
              <em className="not-italic text-muted-foreground">thoughtful things</em>{" "}
              for a <em className="not-italic text-muted-foreground">noisy world.</em>
            </h1>
            <p className="hero-copy animate-fade-rise-delay mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg">
              {profile.introduction}
            </p>
            <Button
              asChild
              variant="glass"
              className="hero-cta liquid-glass animate-fade-rise-delay-2 mt-8 h-auto min-h-14 cursor-pointer rounded-full px-14 py-4 text-base text-foreground active:scale-[0.98] sm:mt-12"
            >
              <a href="#about" onClick={handleAnchorClick}>
                <span className="relative z-[1]">Begin Journey</span>
                <ArrowDown className="relative z-[1]" aria-hidden="true" />
              </a>
            </Button>
          </div>

          {!videoFailed && (
            <Button
              type="button"
              variant="glass"
              onClick={toggleVideoPlayback}
              aria-pressed={isVideoPlaying}
              aria-label={isVideoPlaying ? "Pause background film" : "Play background film"}
              className="liquid-glass absolute bottom-4 right-4 z-20 h-11 min-w-11 cursor-pointer rounded-full px-3 text-foreground active:scale-[0.96] sm:bottom-6 sm:right-6 sm:px-4"
            >
              {isVideoPlaying ? (
                <Pause className="relative z-[1]" aria-hidden="true" />
              ) : (
                <Play className="relative z-[1]" aria-hidden="true" />
              )}
              <span className="relative z-[1] hidden sm:inline">
                {isVideoPlaying ? "Pause film" : "Play film"}
              </span>
            </Button>
          )}
        </section>

        <section
          id="about"
          aria-labelledby="about-title"
          className="scroll-mt-28 border-t border-border bg-background"
        >
          <div className="mx-auto grid max-w-7xl gap-y-10 px-6 py-24 md:px-8 md:py-36 lg:grid-cols-[minmax(7rem,0.55fr)_minmax(16rem,0.9fr)_minmax(0,1.55fr)] lg:items-start lg:gap-x-12 lg:gap-y-0">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
              01 / About
            </p>

            <figure className="w-full max-w-lg overflow-hidden rounded-[14px] border border-foreground/10 bg-muted lg:sticky lg:top-32 lg:max-w-none">
              <img
                src={profile.portrait.src}
                alt={profile.portrait.alt}
                width={profile.portrait.width}
                height={profile.portrait.height}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] h-auto w-full object-cover object-top"
              />
            </figure>

            <article className="min-w-0">
              <h2
                id="about-title"
                className="max-w-4xl text-4xl font-normal leading-[1.05] text-foreground sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                I turn complex evidence into clear decisions.{" "}
                <em className="not-italic text-muted-foreground">
                  Across engineering, finance, and business.
                </em>
              </h2>

              <div className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {profile.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <dl className="mt-10 divide-y divide-border border-y border-border">
                {profile.aboutDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="grid gap-2 py-4 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6"
                  >
                    <dt className="text-sm font-medium text-foreground">{detail.label}</dt>
                    <dd className="text-sm leading-relaxed text-muted-foreground">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>

            <div className="mt-6 min-w-0 lg:col-span-2 lg:col-start-2 lg:mt-16">
              <section aria-labelledby="about-experience-title">
                <h3
                  id="about-experience-title"
                  className="about-resume-heading text-3xl font-normal text-foreground sm:text-4xl"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Experience
                </h3>
                <ol className="mt-6 border-t border-border">
                  {profile.experience.map((experience) => (
                    <li
                      key={`${experience.organization}-${experience.period}`}
                      className="about-resume-row grid gap-3 border-b border-border py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[10rem_minmax(0,42rem)] lg:justify-end lg:gap-x-10 lg:gap-y-3"
                    >
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {experience.period}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-lg font-medium leading-snug text-foreground">
                          {experience.role}
                        </h4>
                        <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                          {experience.organization} / {experience.location}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {experience.summary}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mt-16" aria-labelledby="about-education-title">
                <h3
                  id="about-education-title"
                  className="about-resume-heading text-3xl font-normal text-foreground sm:text-4xl"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Education
                </h3>
                <ol className="mt-6 border-t border-border">
                  {profile.education.map((education) => (
                    <li
                      key={`${education.institution}-${education.period}`}
                      className="about-resume-row grid gap-3 border-b border-border py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[10rem_minmax(0,42rem)] lg:justify-end lg:gap-x-10 lg:gap-y-3"
                    >
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {education.period}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-lg font-medium leading-snug text-foreground">
                          {education.institution}
                        </h4>
                        <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                          {education.degree}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {education.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mt-16" aria-labelledby="about-projects-title">
                <h3
                  id="about-projects-title"
                  className="about-resume-heading text-3xl font-normal text-foreground sm:text-4xl"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Selected projects
                </h3>
                <ol className="mt-6 border-t border-border">
                  {profile.projects.map((project) => (
                    <li
                      key={`${project.title}-${project.period}`}
                      className="about-resume-row grid gap-3 border-b border-border py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[10rem_minmax(0,42rem)] lg:justify-end lg:gap-x-10 lg:gap-y-3"
                    >
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {project.period}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">{project.role}</p>
                        <h4 className="mt-1 text-lg font-medium leading-snug text-foreground">
                          {project.title}
                        </h4>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {project.summary}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mt-16" aria-labelledby="about-record-title">
                <h3
                  id="about-record-title"
                  className="about-resume-heading text-3xl font-normal text-foreground sm:text-4xl"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Research & recognition
                </h3>
                <ul className="about-resume-content mt-6 border-t border-border">
                  {profile.record.map((item) => (
                    <li key={`${item.type}-${item.title}`} className="border-b border-border py-6">
                      <p className="text-sm font-medium text-muted-foreground">
                        {item.type} / {item.meta}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group mt-2 flex min-h-11 items-start justify-between gap-4 text-base font-medium leading-relaxed text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                        >
                          <span>{item.title}</span>
                          <ArrowUpRight
                            className="mt-1 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </a>
                      ) : (
                        <p className="mt-2 text-base font-medium leading-relaxed text-foreground">
                          {item.title}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </section>

        <section
          id="habits"
          aria-labelledby="habits-title"
          className="scroll-mt-28 border-t border-border bg-background"
        >
          <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
            <div className="grid gap-8 md:grid-cols-[0.75fr_2fr] md:gap-20">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                02 / Habits
              </p>
              <div>
                <h2
                  id="habits-title"
                  className="text-4xl font-normal leading-none text-foreground sm:text-5xl"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  What keeps me curious.
                </h2>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Three interests I return to outside the work: movement, attention, and a change of place.
                </p>
              </div>
            </div>

            <nav
              aria-label="Habit pages"
              className="mt-14 grid border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-border md:ml-[calc(27.27%+2.5rem)]"
            >
              {profile.habits.map((habit) => (
                <a
                  key={habit.title}
                  href={`#habit-${habit.id}`}
                  onClick={handleAnchorClick}
                  className="habit-index-link group flex min-h-28 items-center justify-between gap-5 py-5 text-foreground transition-colors hover:bg-foreground/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground sm:px-6 md:min-h-36 md:py-6"
                >
                  <span>
                    <span className="block text-sm tabular-nums text-muted-foreground">
                      {habit.index} / {habit.label}
                    </span>
                    <span
                      className="mt-2 block text-2xl font-normal text-foreground sm:text-3xl"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {habit.name}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </nav>

            <div className="mt-12 border-t border-border md:ml-[calc(27.27%+2.5rem)]">
              {profile.habits.map((habit) => {
                const HabitIcon = habitIcons[habit.id]
                const habitTitleId = `habit-${habit.id}-title`

                return (
                  <article
                    id={`habit-${habit.id}`}
                    key={habit.id}
                    aria-labelledby={habitTitleId}
                    className="habit-page scroll-mt-12 border-b border-border py-12 sm:py-16 md:scroll-mt-16"
                  >
                    <div className="grid gap-8 lg:grid-cols-[0.75fr_2fr] lg:gap-20">
                      <div className="flex items-start justify-between lg:block">
                        <div className="habit-glyph" aria-hidden="true">
                          <HabitIcon />
                        </div>
                        <p className="mt-4 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground lg:mt-6">
                          {habit.index} / {habit.label}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <h3
                          id={habitTitleId}
                          tabIndex={-1}
                          className="max-w-3xl text-5xl font-normal leading-[0.95] text-foreground outline-none sm:text-6xl md:text-7xl"
                          style={{ fontFamily: "'Instrument Serif', serif" }}
                        >
                          {habit.name}
                        </h3>
                        <p className="mt-6 text-2xl leading-tight text-foreground sm:text-3xl">
                          {habit.title}
                        </p>
                        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                          {habit.detail}
                        </p>

                        {habit.media.length > 0 && (
                          <div
                            className="habit-media mt-12 grid gap-6 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] md:items-end"
                            aria-label={`${habit.name} photographs and certificate`}
                          >
                            {habit.media.map((media, mediaIndex) => (
                              <figure
                                key={media.src}
                                className={cn(
                                  "group",
                                  mediaIndex === 1 && "md:mb-10",
                                  media.featured && "md:col-span-2",
                                )}
                              >
                                <div
                                  className={cn(
                                    "overflow-hidden border border-border bg-foreground/[0.03]",
                                    media.featured
                                      ? "aspect-[138/100]"
                                      : mediaIndex === 0
                                        ? "aspect-[3/4]"
                                        : "aspect-[16/9]",
                                  )}
                                >
                                  <img
                                    src={media.src}
                                    alt={media.alt}
                                    width={media.width}
                                    height={media.height}
                                    loading="lazy"
                                    decoding="async"
                                    className={cn(
                                      "h-full w-full transition-transform duration-700 ease-out",
                                      media.featured
                                        ? "object-contain p-2 sm:p-4"
                                        : "object-cover group-hover:scale-[1.02]",
                                    )}
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
                        )}

                        <details className="disclosure group mt-10 max-w-2xl border-t border-border">
                          <summary className="disclosure-summary grid min-h-16 cursor-pointer list-none grid-cols-[1fr_2.75rem] items-center gap-4 py-3 text-sm font-medium text-foreground">
                            <span>Open field note</span>
                            <span className="disclosure-icon" aria-hidden="true">
                              <Plus className="transition-transform duration-200 group-open:rotate-45" />
                            </span>
                          </summary>
                          <div className="disclosure-copy pb-4 pr-14">
                            <p className="text-base leading-relaxed text-muted-foreground">
                              {habit.note}
                            </p>
                          </div>
                        </details>
                      </div>
                    </div>
                    {habit.id === "travelling" && (
                      <TravelJournal view={travelView} onViewChange={onTravelViewChange} />
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section
          id="achievements"
          aria-labelledby="achievements-title"
          className="scroll-mt-28 border-t border-border bg-background"
        >
          <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
            <div className="grid gap-8 md:grid-cols-[0.75fr_2fr] md:gap-20">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                03 / Achievements
              </p>
              <h2
                id="achievements-title"
                className="max-w-3xl text-4xl font-normal leading-none text-foreground sm:text-5xl"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Progress measured in what changed.
              </h2>
            </div>

            <div className="mt-16 border-t border-border md:ml-[calc(27.27%+2.5rem)]">
              {profile.achievements.map((achievement) => (
                <details
                  id={`achievement-${achievement.number}`}
                  key={achievement.number}
                  className="disclosure group scroll-mt-28 border-b border-border"
                >
                  <summary className="disclosure-summary grid min-h-24 cursor-pointer list-none grid-cols-[4rem_1fr_2.75rem] items-center gap-4 py-6 sm:grid-cols-[5rem_1fr_2.75rem] md:gap-8">
                    <span
                      className="text-3xl text-muted-foreground transition-colors group-open:text-foreground"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {achievement.number}
                    </span>
                    <h3 className="text-xl font-medium text-foreground">
                      {achievement.title}
                    </h3>
                    <span className="disclosure-icon" aria-hidden="true">
                      <Plus className="transition-transform duration-200 group-open:rotate-45" />
                    </span>
                  </summary>
                  <div className="disclosure-copy pb-9 pr-14 sm:pl-[5rem] md:pl-[calc(5rem+2rem)]">
                    <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                      {achievement.detail}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          aria-labelledby="contact-title"
          className="scroll-mt-28 border-t border-border bg-background"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-12 px-6 py-24 md:flex-row md:items-end md:px-8 md:py-32">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                04 / Share
              </p>
              <h2
                id="contact-title"
                className="mt-8 max-w-3xl text-5xl font-normal leading-[0.95] text-foreground sm:text-6xl md:text-7xl"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                If this story resonates,{" "}
                <em className="not-italic text-muted-foreground">pass it forward.</em>
              </h2>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
              {profile.email.length > 0 && (
                <Button
                  asChild
                  variant="glass"
                  className="liquid-glass h-auto min-h-12 cursor-pointer rounded-full px-8 py-3 text-base text-foreground active:scale-[0.98]"
                >
                  <a href={`mailto:${profile.email}`}>
                    <span className="relative z-[1]">Say hello</span>
                    <ArrowUpRight className="relative z-[1]" aria-hidden="true" />
                  </a>
                </Button>
              )}
              <Button
                type="button"
                variant="glass"
                onClick={shareProfile}
                className="liquid-glass h-auto min-h-12 cursor-pointer rounded-full px-8 py-3 text-base text-foreground active:scale-[0.98]"
              >
                <span className="relative z-[1]">Share profile</span>
                <Share2 className="relative z-[1]" aria-hidden="true" />
              </Button>
              <p
                className="min-h-5 max-w-xs text-sm text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                {shareStatus}
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-border bg-background">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-5">
              <p>{profile.name}</p>
              <p>Designed with attention.</p>
            </div>
            <Button
              asChild
              variant="ghost"
              className="h-11 w-fit cursor-pointer rounded-full px-4 text-muted-foreground hover:text-foreground"
            >
              <a href="#home" onClick={handleAnchorClick}>
                Back to top
                <ArrowUp aria-hidden="true" />
              </a>
            </Button>
          </div>
        </footer>
      </main>
    </>
  )
}

function App() {
  const [route, setRoute] = useState(() => parseTravelRoute(window.location.hash))
  const routeRef = useRef(route)
  const portfolioScroll = useRef<number | null>(null)
  const [travelView, setTravelView] = useState<TravelViewState>(() => ({
    country: "all",
    query: "",
    mode: "destinations",
  }))

  useEffect(() => {
    const syncRoute = () => {
      const next = parseTravelRoute(window.location.hash)
      if (!routeRef.current && next) portfolioScroll.current = window.scrollY
      routeRef.current = next
      setRoute((current) => current?.slug === next?.slug && current?.kind === next?.kind ? current : next)
    }
    window.addEventListener("hashchange", syncRoute)
    window.addEventListener("popstate", syncRoute)
    return () => {
      window.removeEventListener("hashchange", syncRoute)
      window.removeEventListener("popstate", syncRoute)
    }
  }, [])

  useEffect(() => {
    if (route) return
    const frame = window.requestAnimationFrame(() => {
      const id = window.location.hash.slice(1)
      const target = document.getElementById(id)
      if (id === "habit-travelling" && portfolioScroll.current !== null) {
        window.scrollTo({ top: portfolioScroll.current, behavior: "instant" })
      } else if (target) {
        target.scrollIntoView({ behavior: "instant", block: "start" })
      }
      const heading = target?.querySelector<HTMLElement>("h1, h2, h3")
      if (heading) {
        heading.tabIndex = -1
        heading.focus({ preventScroll: true })
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [route])

  if (route) {
    return (
      <Suspense fallback={<main className="mx-auto min-h-svh max-w-7xl px-6 py-36 text-muted-foreground" aria-busy="true"><p role="status">Opening the city chapter…</p></main>}>
        <CityPage key={`${route.kind}/${route.slug}`} route={route} />
      </Suspense>
    )
  }

  return <Portfolio travelView={travelView} onTravelViewChange={setTravelView} />
}

export default App
