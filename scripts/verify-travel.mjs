import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import ts from "typescript"

const source = await readFile(new URL("../src/data/travel.ts", import.meta.url), "utf8")
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext } }).outputText
const travel = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`)
const { cityHref, destinationHref, parseTravelRoute, getCountries, visitedCities, visitedDestinations } = travel
const map = JSON.parse(await readFile(new URL("../public/data/world-countries.json", import.meta.url), "utf8"))

assert.equal(parseTravelRoute("#habit-travelling"), null)
assert.deepEqual(parseTravelRoute("#/travel/hong-kong"), { slug: "hong-kong", kind: "city" })
assert.deepEqual(parseTravelRoute("#/travel/country/france"), { slug: "france", kind: "country" })
assert.deepEqual(parseTravelRoute("#/travel/country/%E0%A4%A"), { slug: "", kind: "country" })
assert.deepEqual(parseTravelRoute(cityHref({ slug: "São Paulo" })), { slug: "São Paulo", kind: "city" })
assert.deepEqual(parseTravelRoute(destinationHref({ slug: "south-korea" })), { slug: "south-korea", kind: "country" })
assert.equal(visitedDestinations.length, 20)
assert.equal(new Set(visitedDestinations.map((place) => place.code)).size, visitedDestinations.length)
assert.equal(new Set(visitedDestinations.map((place) => place.slug)).size, visitedDestinations.length)
assert.deepEqual(getCountries(visitedCities).map((country) => country.code).sort(), ["HKG", "MAC", "MCO", "SGP"])
assert.ok(map.length >= 170)
assert.equal(new Set(map.map((country) => country.code)).size, map.length)
for (const code of ["DNK", "FIN", "FRA", "DEU", "ITA", "JPN", "MAR", "NOR", "POL", "RUS", "KOR", "ESP", "SWE", "CHE", "TWN", "GBR"]) assert.ok(map.some((country) => country.code === code), `Missing outline for ${code}`)
for (const place of visitedDestinations) {
  assert.ok(/^[A-Z]{3}$/.test(place.code))
  assert.ok(place.slug && /^[^/?#]+$/.test(place.slug))
  assert.ok(Number.isFinite(place.coordinates.longitude) && Math.abs(place.coordinates.longitude) <= 180)
  assert.ok(Number.isFinite(place.coordinates.latitude) && Math.abs(place.coordinates.latitude) <= 90)
  assert.deepEqual(parseTravelRoute(destinationHref(place)), { slug: place.slug, kind: "country" })
}
for (const city of visitedCities) {
  assert.ok(visitedDestinations.some((place) => place.code === city.countryCode))
  assert.equal(city.story.length, 0, "No unsupported personal story should be introduced")
  assert.equal(city.moments.length, 0, "No unsupported personal moment should be introduced")
  assert.deepEqual(parseTravelRoute(cityHref(city)), { slug: city.slug, kind: "city" })
}
console.log(`Travel checks passed: ${visitedDestinations.length} supplied destinations, ${visitedCities.length} city/locality chapters, ${map.length} map outlines.`)
