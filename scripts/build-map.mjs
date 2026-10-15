// Builds src/data/marketplace.json: every US state as a pre-projected SVG path (Albers USA,
// Alaska and Hawaii inset, 975x610 like the us-atlas convention) plus the refinery listings
// with their projected map coordinates. Run with `npm run map`. The page then needs no geo
// library at runtime.
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { geoAlbersUsa, geoPath } from 'd3-geo'
import { feature, mesh } from 'topojson-client'
import { presimplify, quantile, simplify } from 'topojson-simplify'
import { REFINERIES, REGIONS } from './refineries.mjs'

const require = createRequire(import.meta.url)
// simplified: the map is decorative, a 1:10m coastline would triple the chunk for no visible gain
const raw = JSON.parse(readFileSync(require.resolve('us-atlas/states-10m.json'), 'utf8'))
const pre = presimplify(raw)
const topology = simplify(pre, quantile(pre, 0.25))

const WIDTH = 975
const HEIGHT = 610
const projection = geoAlbersUsa().scale(1300).translate([WIDTH / 2, HEIGHT / 2])
const path = geoPath(projection).digits(1)

// FIPS code -> postal abbreviation, so the states can be grouped into regions
const FIPS = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO', '09': 'CT', 10: 'DE', 11: 'DC', 12: 'FL',
  13: 'GA', 15: 'HI', 16: 'ID', 17: 'IL', 18: 'IN', 19: 'IA', 20: 'KS', 21: 'KY', 22: 'LA', 23: 'ME', 24: 'MD',
  25: 'MA', 26: 'MI', 27: 'MN', 28: 'MS', 29: 'MO', 30: 'MT', 31: 'NE', 32: 'NV', 33: 'NH', 34: 'NJ', 35: 'NM',
  36: 'NY', 37: 'NC', 38: 'ND', 39: 'OH', 40: 'OK', 41: 'OR', 42: 'PA', 44: 'RI', 45: 'SC', 46: 'SD', 47: 'TN',
  48: 'TX', 49: 'UT', 50: 'VT', 51: 'VA', 53: 'WA', 54: 'WV', 55: 'WI', 56: 'WY',
}
const regionOfState = (st) => REGIONS.find((r) => r.states.includes(st))?.key ?? null

const states = feature(topology, topology.objects.states)
  .features.filter((f) => FIPS[f.id])
  .map((f) => ({ id: FIPS[f.id], name: f.properties.name, region: regionOfState(FIPS[f.id]), d: path(f) }))
  .filter((s) => s.d)

// one path for all the interior borders, drawn once so shared edges are not doubled
const borders = path(mesh(topology, topology.objects.states, (a, b) => a !== b))
const outline = path(mesh(topology, topology.objects.states, (a, b) => a === b))

const refineries = REFINERIES.map((r) => {
  const p = projection([r.lon, r.lat])
  if (!p) throw new Error(`${r.id} falls outside the projection`)
  return { ...r, x: +p[0].toFixed(1), y: +p[1].toFixed(1) }
})

const out = {
  width: WIDTH,
  height: HEIGHT,
  regions: REGIONS.map(({ states: _s, ...r }) => r),
  states,
  borders,
  outline,
  refineries,
}
writeFileSync(new URL('../src/data/marketplace.json', import.meta.url), JSON.stringify(out))
console.log(`wrote ${states.length} states and ${refineries.length} refineries`)
