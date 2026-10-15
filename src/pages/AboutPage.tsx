import { useEffect, useRef, type ReactNode } from "react"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { profile } from "@/data/profile"

function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        className="skip-link"
        href="#about-content"
        onClick={(event) => {
          event.preventDefault()
          const content = document.getElementById("about-content")
          content?.scrollIntoView({ behavior: "instant" })
          content?.focus({ preventScroll: true })
        }}
      >
        Skip to profile
      </a>
      <header className="site-header fixed inset-x-0 top-0 z-40 px-3 sm:px-6">
        <nav
          aria-label="Profile navigation"
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
            <a href="#about">
              <ArrowLeft className="relative z-[1]" aria-hidden="true" />
              <span className="relative z-[1]">Portfolio</span>
            </a>
          </Button>
        </nav>
      </header>
      <main
        id="about-content"
        tabIndex={-1}
        className="about-detail-page mx-auto min-h-svh max-w-7xl px-6 pb-16 pt-36 text-foreground outline-none sm:pt-44 md:px-8"
      >
        {children}
      </main>
    </>
  )
}

function useAboutPage(headingRef: React.RefObject<HTMLHeadingElement>) {
  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = meta?.content
    document.title = `About ${profile.name}`
    if (meta) meta.content = `${profile.name}'s experience, education, projects, and research.`
    window.scrollTo({ top: 0, behavior: "instant" })
    headingRef.current?.focus({ preventScroll: true })
    return () => {
      document.title = previousTitle
      if (meta && previousDescription !== undefined) meta.content = previousDescription
    }
  }, [headingRef])
}

export default function AboutPage() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useAboutPage(headingRef)

  return (
    <PageShell>
      <nav className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <a href="#home" className="travel-text-link">Portfolio</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-foreground">About</span>
      </nav>

      <article>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
          <figure className="w-full max-w-lg overflow-hidden rounded-[14px] border border-foreground/10 bg-muted lg:sticky lg:top-36 lg:max-w-none">
            <img
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              width={profile.portrait.width}
              height={profile.portrait.height}
              loading="eager"
              decoding="async"
              className="aspect-[4/5] h-auto w-full object-cover object-top"
            />
          </figure>

          <div className="min-w-0">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">01 / About</p>
            <h1 ref={headingRef} tabIndex={-1} className="travel-display mt-5 max-w-4xl text-6xl leading-[0.95] outline-none sm:text-8xl">
              A closer look at the work.
            </h1>
            <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>

            <dl className="mt-10 divide-y divide-border border-y border-border">
              {profile.aboutDetails.map((detail) => (
                <div key={detail.label} className="grid gap-2 py-4 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="text-sm font-medium text-foreground">{detail.label}</dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-24 lg:ml-[calc(27.27%+2.5rem)]">
          <ResumeSection title="Experience">
            <ol className="mt-6 border-t border-border">
              {profile.experience.map((experience) => (
                <li key={`${experience.organization}-${experience.period}`} className="about-resume-row grid gap-3 border-b border-border py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[10rem_minmax(0,42rem)] lg:justify-end lg:gap-x-10 lg:gap-y-3">
                  <span className="text-sm tabular-nums text-muted-foreground">{experience.period}</span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-medium leading-snug text-foreground">{experience.role}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/80">{experience.organization} / {experience.location}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{experience.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </ResumeSection>

          <ResumeSection title="Education" className="mt-16">
            <ol className="mt-6 border-t border-border">
              {profile.education.map((education) => (
                <li key={`${education.institution}-${education.period}`} className="about-resume-row grid gap-3 border-b border-border py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[10rem_minmax(0,42rem)] lg:justify-end lg:gap-x-10 lg:gap-y-3">
                  <span className="text-sm tabular-nums text-muted-foreground">{education.period}</span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-medium leading-snug text-foreground">{education.institution}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/80">{education.degree}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{education.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </ResumeSection>

          <ResumeSection title="Selected projects" className="mt-16">
            <ol className="mt-6 border-t border-border">
              {profile.projects.map((project) => (
                <li key={`${project.title}-${project.period}`} className="about-resume-row grid gap-3 border-b border-border py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[10rem_minmax(0,42rem)] lg:justify-end lg:gap-x-10 lg:gap-y-3">
                  <span className="text-sm tabular-nums text-muted-foreground">{project.period}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">{project.role}</p>
                    <h3 className="mt-1 text-lg font-medium leading-snug text-foreground">{project.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </ResumeSection>

          <ResumeSection title="Research & recognition" className="mt-16">
            <ul className="about-resume-content mt-6 border-t border-border">
              {profile.record.map((item) => (
                <li key={`${item.type}-${item.title}`} className="border-b border-border py-6">
                  <p className="text-sm font-medium text-muted-foreground">{item.type} / {item.meta}</p>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className="group mt-2 flex min-h-11 items-start justify-between gap-4 text-base font-medium leading-relaxed text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
                      <span>{item.title}</span>
                      <ArrowUpRight className="mt-1 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="mt-2 text-base font-medium leading-relaxed text-foreground">{item.title}</p>
                  )}
                </li>
              ))}
            </ul>
          </ResumeSection>
        </div>
      </article>

      <nav aria-label="Profile navigation" className="mt-20 border-y border-border py-8">
        <a href="#home" className="travel-chapter-link group flex items-center justify-between gap-5">
          <span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Back to portfolio</span>
            <span className="travel-display mt-3 block text-3xl sm:text-4xl">The full field journal</span>
          </span>
          <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      </nav>
    </PageShell>
  )
}

function ResumeSection({ title, className = "", children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <section className={className} aria-labelledby={`resume-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
      <h2 id={`resume-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="about-resume-heading text-3xl font-normal text-foreground sm:text-4xl" style={{ fontFamily: "'Instrument Serif', serif" }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
