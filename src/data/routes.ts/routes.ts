import { parseTravelRoute, type TravelRoute } from "@/data/travel"

export type HabitRoute = { kind: "habit"; slug: string }
export type AboutRoute = { kind: "about"; slug: "about" }
export type AppRoute = HabitRoute | AboutRoute | TravelRoute

export function habitHref(slug: string) {
  return `#/habit/${encodeURIComponent(slug)}`
}

export function parseHabitRoute(hash: string): HabitRoute | null {
  const isLegacy = hash.startsWith("#habit-")
  const isCanonical = hash.startsWith("#/habit/")
  if (!isLegacy && !isCanonical) return null

  const raw = isLegacy ? hash.slice("#habit-".length) : hash.slice("#/habit/".length)
  const match = /^([^/?#]+)(?:\?.*)?$/.exec(raw)
  if (!match) return { kind: "habit", slug: "" }

  try {
    return { kind: "habit", slug: decodeURIComponent(match[1]) }
  } catch {
    return { kind: "habit", slug: "" }
  }
}

export function parseAppRoute(hash: string): AppRoute | null {
  const habit = parseHabitRoute(hash)
  if (habit) return habit
  if (hash === "#/about") return { kind: "about", slug: "about" }
  return parseTravelRoute(hash)
}
