import { useEffect, useState } from "react"

type JourneyState = {
  activeSection: string
  isScrolled: boolean
  progress: number
}

export function useJourneyProgress(sectionIds: readonly string[]) {
  const [journey, setJourney] = useState<JourneyState>({
    activeSection: sectionIds[0] ?? "home",
    isScrolled: false,
    progress: 0,
  })

  useEffect(() => {
    let frame = 0

    const updateJourney = () => {
      const scrollableHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      )
      const marker = window.innerHeight * 0.34
      let activeSection = sectionIds[0] ?? "home"

      for (const sectionId of sectionIds) {
        const section = document.getElementById(sectionId)
        if (section && section.getBoundingClientRect().top <= marker) {
          activeSection = sectionId
        }
      }

      const nextJourney = {
        activeSection,
        isScrolled: window.scrollY > 28,
        progress: Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1),
      }

      setJourney((current) => {
        if (
          current.activeSection === nextJourney.activeSection &&
          current.isScrolled === nextJourney.isScrolled &&
          Math.abs(current.progress - nextJourney.progress) < 0.002
        ) {
          return current
        }

        return nextJourney
      })

      frame = 0
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateJourney)
    }

    const resizeObserver = new ResizeObserver(requestUpdate)
    resizeObserver.observe(document.body)
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
    requestUpdate()

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
    }
  }, [sectionIds])

  return journey
}
