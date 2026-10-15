import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { REVEAL } from '../../motionPrefs.js'
import MAP from '../../data/marketplace.json'

// Everything the marketplace preview pages share: the placeholder listings (real US
// refineries, see scripts/refineries.mjs), the pre-projected map, the locked "preview"
// widgets, and the deterministic illustrative figures that dress each site's page.

export const EASE = [0.22, 1, 0.36, 1]
export const US_CAPACITY_BPD = 18_400_000 // approximate total US operable refining capacity
export const glass = 'rounded-2xl bg-white ring-1 ring-navy/[0.08] shadow-[0_16px_40px_-28px_rgba(23,23,43,0.28)]'

export const fade = (delay = 0) => ({
  initial: REVEAL ? { opacity: 0, y: 24, filter: 'blur(8px)' } : false,
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-60px' },
  transition: { delay, duration: 0.8, ease: EASE },
})

export const REGIONS = MAP.regions
export const REGION_BY_KEY = Object.fromEntries(REGIONS.map((r) => [r.key, r]))
export const REFINERIES = [...MAP.refineries].sort((a, b) => b.capacity - a.capacity)
export const BY_ID = Object.fromEntries(REFINERIES.map((r) => [r.id, r]))
export const TOP_TEN = new Set(REFINERIES.slice(0, 10).map((r) => r.id))
export const WORDS = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
export const TOP_TEN_GULF = WORDS[REFINERIES.slice(0, 10).filter((r) => r.region === 'gulf').length]

export const fmtInt = (n) => Math.round(n).toLocaleString('en-US')
export const fmtUsd = (n, d = 2) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: d, maximumFractionDigits: d })
export const fmtBpd = (n) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : `${Math.round(n / 1000)}K`)
export const fmtPct = (n, d = 1) => `${n.toFixed(d)}%`
export const regionName = (key) => REGION_BY_KEY[key]?.name ?? key

// the filter is either a region key, 'top' (ten largest) or 'all'
export function inFilter(r, filter) {
  if (filter === 'all') return true
  if (filter === 'top') return TOP_TEN.has(r.id)
  return r.region === filter
}

export function LockIcon({ className = 'h-3 w-3' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  )
}

// every call to action on this page: greyed, locked and announced as a preview
export function PreviewButton({ children, primary = false, className = '' }) {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      title="Preview only. Trading is not live."
      className={`inline-flex cursor-not-allowed select-none items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] ${
        primary ? 'bg-navy/[0.08] text-mist-faint' : 'border border-navy/15 text-mist-faint'
      } ${className}`}
    >
      <LockIcon />
      {children}
    </button>
  )
}

export function PreviewTag({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-brass/10 px-2.5 py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-brass ${className}`}>
      <LockIcon className="h-2.5 w-2.5" />
      Preview
    </span>
  )
}

// the dot radius in map units; the screen scale keeps dots tappable on phones
export function dotRadius(capacity, k) {
  const r = 2.6 + Math.sqrt(capacity / 1000) * 0.3
  return Math.max(r, 4.5 * k)
}

export function UsMap({ filter, selected, hovered, onHover, onSelect, onRegion, legend = true }) {
  const box = useRef(null)
  const [k, setK] = useState(1) // map units per CSS pixel
  useEffect(() => {
    const el = box.current
    if (!el) return undefined
    const update = () => setK(MAP.width / Math.max(el.clientWidth, 1))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const hover = hovered ? BY_ID[hovered] : null
  const regionOn = filter !== 'all' && filter !== 'top'

  return (
    <div ref={box} className="relative w-full select-none" style={{ aspectRatio: `${MAP.width} / ${MAP.height}` }}>
      <svg viewBox={`0 0 ${MAP.width} ${MAP.height}`} className="h-full w-full overflow-visible" role="img" aria-label="Map of the United States with refinery locations">
        <defs>
          <radialGradient id="mk-glow">
            <stop offset="0%" stopColor="#32E7D0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#32E7D0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* states: the active region lifts in aqua, the rest sink to a faint indigo tint */}
        <g onMouseLeave={() => onHover(null)}>
          {MAP.states.map((s) => {
            const active = regionOn && s.region === filter
            return (
              <path
                key={s.id}
                d={s.d}
                className={`cursor-pointer transition-[fill] duration-300 ${
                  active ? 'fill-gold/[0.22] hover:fill-gold/[0.3]' : regionOn ? 'fill-navy/[0.025] hover:fill-navy/[0.06]' : 'fill-navy/[0.045] hover:fill-gold/[0.16]'
                }`}
                onClick={() => s.region && onRegion(s.region)}
              >
                <title>{s.name}</title>
              </path>
            )
          })}
        </g>
        <path d={MAP.borders} fill="none" className="stroke-paper" strokeWidth={1.4 * Math.min(k, 2)} strokeLinejoin="round" pointerEvents="none" />
        <path d={MAP.outline} fill="none" className="stroke-navy/20" strokeWidth={1.1 * Math.min(k, 2)} strokeLinejoin="round" pointerEvents="none" />

        {/* refineries, largest drawn first so the small ones stay on top */}
        <g>
          {REFINERIES.map((r) => {
            const on = inFilter(r, filter)
            const isSel = r.id === selected
            const isHov = r.id === hovered
            const rad = dotRadius(r.capacity, k)
            return (
              <g
                key={r.id}
                transform={`translate(${r.x} ${r.y})`}
                className="cursor-pointer"
                style={{ opacity: on ? 1 : 0.18, transition: 'opacity 300ms' }}
                onMouseEnter={() => onHover(r.id)}
                onMouseLeave={() => onHover(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(r.id)
                }}
              >
                {r.capacity >= 180_000 && on && <circle r={rad * 2.6} fill="url(#mk-glow)" />}
                {isSel && (
                  <circle
                    r={rad * 1.9}
                    fill="none"
                    className="animate-ping stroke-gold"
                    strokeWidth={1.2 * k}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDuration: '1.8s' }}
                  />
                )}
                <circle
                  r={isSel || isHov ? rad * 1.25 : rad}
                  className={`${isSel ? 'fill-gold-deep' : 'fill-gold'} stroke-paper transition-[r] duration-200`}
                  strokeWidth={1.2 * k}
                />
                {/* generous invisible hit area for thumbs */}
                <circle r={Math.max(rad * 1.6, 12 * k)} fill="transparent" />
              </g>
            )
          })}
        </g>
      </svg>

      {/* hover label, positioned in map percentages so it tracks the responsive SVG */}
      <AnimatePresence>
        {hover && (
          <motion.div
            key={hover.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-mist px-3 py-2 text-paper shadow-lg"
            style={{ left: `${(hover.x / MAP.width) * 100}%`, top: `calc(${(hover.y / MAP.height) * 100}% - ${dotRadius(hover.capacity, k) / k + 8}px)` }}
          >
            <div className="text-[12px] font-semibold">{hover.name}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/70">
              {hover.operator} · {fmtInt(hover.capacity)} bbl/d
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* legend */}
      {legend && (
      <div className="pointer-events-none absolute bottom-0 left-0 hidden items-end gap-4 font-mono text-[9.5px] uppercase tracking-[0.16em] text-mist-faint sm:flex">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold ring-1 ring-paper" />
          <span className="h-3 w-3 rounded-full bg-gold ring-1 ring-paper" />
          <span className="ml-1">Dot size = capacity</span>
        </div>
        <span>Tap a state to pick its region</span>
      </div>
      )}
    </div>
  )
}

export function Stat({ label, value, sub }) {
  return (
    <div>
      <div className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-mist-faint">{label}</div>
      <div className="mt-1 font-display text-[22px] font-semibold tabular-nums tracking-[-0.02em] text-mist">{value}</div>
      {sub && <div className="text-[12px] text-mist-faint">{sub}</div>}
    </div>
  )
}

// the mock order ticket: a frosted sheet over it says why it does nothing
export function OrderTicket({ refinery }) {
  const tokens = 500
  return (
    <div className="relative mt-6 overflow-hidden rounded-xl border border-navy/10 bg-ink-900">
      {/* blurred in place rather than through a backdrop filter, which phones turn off */}
      <div className="pointer-events-none select-none space-y-3 p-4 opacity-70 blur-[2.5px]" aria-hidden="true">
        <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.2em] text-mist-faint">
          <span>Order</span>
          <span>{refinery.ticker}</span>
        </div>
        <div className="flex items-end justify-between gap-4 rounded-md bg-paper px-3 py-2.5 ring-1 ring-navy/10">
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-mist-faint">You pay</div>
            <div className="font-display text-xl font-semibold tabular-nums text-mist">{fmtUsd(tokens * refinery.price, 0)}</div>
          </div>
          <div className="text-[12px] font-medium text-mist-faint">USDC</div>
        </div>
        <div className="flex items-end justify-between gap-4 rounded-md bg-paper px-3 py-2.5 ring-1 ring-navy/10">
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-mist-faint">You receive</div>
            <div className="font-display text-xl font-semibold tabular-nums text-mist">{fmtInt(tokens)}</div>
          </div>
          <div className="text-[12px] font-medium text-mist-faint">{refinery.ticker}</div>
        </div>
        <div className="flex gap-2 pt-1">
          <PreviewButton primary className="flex-1">
            Buy
          </PreviewButton>
          <PreviewButton className="flex-1">Watch</PreviewButton>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-paper/35">
        <div className="rounded-full bg-mist px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-paper shadow-lg">
          Preview · trading is not live
        </div>
      </div>
    </div>
  )
}
// the strip that opens every marketplace page
export function PreviewStrip() {
  return (
    <div className="relative border-b border-brass/20 bg-brass/[0.07]">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-6 py-2.5 text-center">
        <LockIcon className="h-3 w-3 flex-none text-brass" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
          Design preview · nothing here is live or for sale · listings are placeholders
        </p>
      </div>
    </div>
  )
}

export const sitePath = (id) => `#/refinery/${id}`
export const mapPath = (id) => `#/marketplace/${id}`

// ---- illustrative figures -------------------------------------------------------------
// Everything below is made up, deterministically from the site id, so a page looks the same
// on every visit without anything being true. Capacity, location and operator are the only
// real facts about a site.

function seed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

function rng(str) {
  let a = seed(str)
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const between = (r, lo, hi) => lo + r() * (hi - lo)

// where each region's crude tends to come from
const CRUDE_SOURCES = {
  gulf: ['Permian Basin', 'Eagle Ford', 'Gulf of Mexico offshore', 'Imported heavy (Mexico, Canada)'],
  midwest: ['Bakken', 'Western Canadian Select', 'Permian Basin', 'Illinois Basin'],
  east: ['Bakken by rail', 'Imported light sweet (West Africa)', 'Gulf Coast by ship', 'Canadian by rail'],
  rockies: ['DJ Basin', 'Powder River Basin', 'Western Canadian Select', 'Uinta Basin waxy crude'],
  west: ['Alaska North Slope', 'San Joaquin Valley heavy', 'Imported (Ecuador, Iraq, Saudi Arabia)', 'Bakken by rail'],
}

const PRODUCTS = [
  { key: 'gasoline', label: 'Gasoline', color: '#32E7D0' },
  { key: 'diesel', label: 'Diesel', color: '#3127CC' },
  { key: 'jet', label: 'Jet fuel', color: '#8C86F5' },
  { key: 'other', label: 'Other', color: '#C9C6FF' },
]
export { PRODUCTS }

const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

export function profile(r) {
  const next = rng(r.id)
  // crude slate
  const sour = Math.round(between(next, r.region === 'gulf' || r.region === 'west' ? 45 : 25, r.region === 'gulf' || r.region === 'west' ? 80 : 60))
  const imported = Math.round(between(next, r.region === 'east' || r.region === 'west' ? 35 : 5, r.region === 'east' || r.region === 'west' ? 70 : 35))
  // product yield, sums to 100
  let gasoline = Math.round(between(next, 42, 54))
  let diesel = Math.round(between(next, 24, 34))
  let jet = Math.round(between(next, 6, 12))
  const other = 100 - gasoline - diesel - jet
  // complexity: big Gulf plants are the most complex
  const complexity = +(between(next, 7, 10) + (r.capacity > 400000 ? 2.5 : r.capacity > 200000 ? 1.2 : 0)).toFixed(1)
  // twelve months of utilization, with a maintenance dip somewhere
  const dipAt = Math.floor(next() * 12)
  const base = between(next, 86, 95)
  const utilization = MONTHS.map((m, i) => ({
    month: m,
    pct: Math.round(Math.max(55, Math.min(99, base + between(next, -3, 3) - (i === dipAt ? between(next, 14, 30) : 0)))),
  }))
  // token figures
  const supply = r.capacity
  const placed = r.placed
  const change30 = +between(next, -9, 14).toFixed(1)
  const price30 = []
  let p = r.price / (1 + change30 / 100)
  for (let i = 0; i < 30; i++) {
    p *= 1 + between(next, -0.02, 0.021)
    price30.push(p)
  }
  // land the series on today's price so the headline number matches the chart
  const scale = r.price / price30[price30.length - 1]
  for (let i = 0; i < price30.length; i++) price30[i] *= scale
  const volume24h = Math.round(supply * placed / 100 * between(next, 0.004, 0.02)) * r.price
  const distPerToken = +between(next, 1.4, 3.8).toFixed(2) // illustrative yearly distribution per token
  const crack = +between(next, 18, 34).toFixed(2) // 3-2-1 crack spread, $/bbl
  const sources = CRUDE_SOURCES[r.region] || CRUDE_SOURCES.gulf
  const srcCount = 2 + Math.floor(next() * 2)
  const start = Math.floor(next() * sources.length)
  const crudeSources = Array.from({ length: srcCount }, (_, i) => sources[(start + i) % sources.length])
  const units = Math.round(between(next, 8, 24))
  const employees = Math.round(r.capacity / between(next, 260, 420) / 10) * 10
  const acres = Math.round(r.capacity / between(next, 180, 320) / 10) * 10
  return {
    sour,
    imported,
    yieldMix: { gasoline, diesel, jet, other },
    complexity,
    utilization,
    supply,
    placed,
    change30,
    price30,
    marketCap: supply * r.price,
    volume24h,
    distPerToken,
    crack,
    crudeSources,
    units,
    employees,
    acres,
  }
}

// rank of a site by capacity, nationally and in its region
export function ranks(r) {
  const national = REFINERIES.findIndex((x) => x.id === r.id) + 1
  const regional = REFINERIES.filter((x) => x.region === r.region).findIndex((x) => x.id === r.id) + 1
  return { national, regional, regionCount: REFINERIES.filter((x) => x.region === r.region).length }
}

// the closest other sites on the map, for the "nearby" rail
export function nearby(r, n = 3) {
  return REFINERIES.filter((x) => x.id !== r.id)
    .map((x) => ({ x, d: Math.hypot(x.x - r.x, x.y - r.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n)
    .map((e) => e.x)
}
