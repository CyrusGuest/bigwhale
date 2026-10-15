import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { REVEAL } from '../motionPrefs.js'
import { OilMark } from './Hero.jsx'
import MAP from '../data/marketplace.json'

// A design preview of a marketplace for tokenized refining capacity. Nothing here works on
// purpose: every action is disabled, every price is illustrative, and the listings are real
// US refineries used as placeholders (see scripts/refineries.mjs). XTO has no relationship
// with any of them. The map and its coordinates are pre-projected at build time (npm run map).

const EASE = [0.22, 1, 0.36, 1]
const US_CAPACITY_BPD = 18_400_000 // approximate total US operable refining capacity
const INITIAL_LISTINGS = 12
const glass = 'rounded-2xl bg-white ring-1 ring-navy/[0.08] shadow-[0_16px_40px_-28px_rgba(23,23,43,0.28)]'

const fade = (delay = 0) => ({
  initial: REVEAL ? { opacity: 0, y: 24, filter: 'blur(8px)' } : false,
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-60px' },
  transition: { delay, duration: 0.8, ease: EASE },
})

const REGIONS = MAP.regions
const REGION_BY_KEY = Object.fromEntries(REGIONS.map((r) => [r.key, r]))
const REFINERIES = [...MAP.refineries].sort((a, b) => b.capacity - a.capacity)
const BY_ID = Object.fromEntries(REFINERIES.map((r) => [r.id, r]))
const TOP_TEN = new Set(REFINERIES.slice(0, 10).map((r) => r.id))
const WORDS = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
const TOP_TEN_GULF = WORDS[REFINERIES.slice(0, 10).filter((r) => r.region === 'gulf').length]

const fmtInt = (n) => Math.round(n).toLocaleString('en-US')
const fmtUsd = (n, d = 2) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: d, maximumFractionDigits: d })
const fmtBpd = (n) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : `${Math.round(n / 1000)}K`)
const fmtPct = (n, d = 1) => `${n.toFixed(d)}%`
const regionName = (key) => REGION_BY_KEY[key]?.name ?? key

// the filter is either a region key, 'top' (ten largest) or 'all'
function inFilter(r, filter) {
  if (filter === 'all') return true
  if (filter === 'top') return TOP_TEN.has(r.id)
  return r.region === filter
}

function LockIcon({ className = 'h-3 w-3' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  )
}

// every call to action on this page: greyed, locked and announced as a preview
function PreviewButton({ children, primary = false, className = '' }) {
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

function PreviewTag({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-brass/10 px-2.5 py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-brass ${className}`}>
      <LockIcon className="h-2.5 w-2.5" />
      Preview
    </span>
  )
}

// the dot radius in map units; the screen scale keeps dots tappable on phones
function dotRadius(capacity, k) {
  const r = 2.6 + Math.sqrt(capacity / 1000) * 0.3
  return Math.max(r, 4.5 * k)
}

function UsMap({ filter, selected, hovered, onHover, onSelect, onRegion }) {
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
      <div className="pointer-events-none absolute bottom-0 left-0 hidden items-end gap-4 font-mono text-[9.5px] uppercase tracking-[0.16em] text-mist-faint sm:flex">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold ring-1 ring-paper" />
          <span className="h-3 w-3 rounded-full bg-gold ring-1 ring-paper" />
          <span className="ml-1">Dot size = capacity</span>
        </div>
        <span>Tap a state to pick its region</span>
      </div>
    </div>
  )
}

function Stat({ label, value, sub }) {
  return (
    <div>
      <div className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-mist-faint">{label}</div>
      <div className="mt-1 font-display text-[22px] font-semibold tabular-nums tracking-[-0.02em] text-mist">{value}</div>
      {sub && <div className="text-[12px] text-mist-faint">{sub}</div>}
    </div>
  )
}

// the mock order ticket: a frosted sheet over it says why it does nothing
function OrderTicket({ refinery }) {
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

function RefineryDetail({ refinery, onBack }) {
  const share = (refinery.capacity / US_CAPACITY_BPD) * 100
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-gold-deep">
            {refinery.operator} · {regionName(refinery.region)}
          </div>
          <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight text-mist">{refinery.name}</h3>
          <div className="mt-1 text-[13px] text-mist-dim">
            {refinery.city}, {refinery.state}
          </div>
        </div>
        <button type="button" onClick={onBack} className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-mist-faint transition-colors hover:bg-navy/[0.06] hover:text-mist" aria-label="Back to the region">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-3.5 w-3.5">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
        <Stat label="Capacity" value={`${fmtInt(refinery.capacity)}`} sub="barrels per day" />
        <Stat label="Of US refining" value={fmtPct(share, 2)} sub="of national capacity" />
        <Stat label="Token" value={refinery.ticker} sub="one token per bbl/d" />
        <Stat label="Price" value={fmtUsd(refinery.price)} sub="illustrative" />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.2em] text-mist-faint">
          <span>Placed in preview</span>
          <span className="tabular-nums">{refinery.placed}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy/[0.07]">
          <div className="h-full rounded-full bg-gradient-to-r from-gold-deep/70 to-gold" style={{ width: `${refinery.placed}%` }} />
        </div>
      </div>

      <OrderTicket refinery={refinery} />
    </div>
  )
}

function RegionDetail({ filter, onSelect }) {
  const list = REFINERIES.filter((r) => inFilter(r, filter))
  const total = list.reduce((s, r) => s + r.capacity, 0)
  const title = filter === 'all' ? 'The whole country' : filter === 'top' ? "America's ten largest" : regionName(filter)
  const blurb =
    filter === 'all'
      ? 'Every listing on the map. Pick a region, or tap a dot, to narrow it down.'
      : filter === 'top'
        ? `The ten biggest plants in the country, ${TOP_TEN_GULF} of them on the Gulf Coast.`
        : REGION_BY_KEY[filter]?.blurb
  return (
    <div>
      <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-gold-deep">{filter === 'all' || filter === 'top' ? 'Selection' : `Region · PADD ${REGION_BY_KEY[filter]?.padd}`}</div>
      <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight text-mist">{title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-mist-dim">{blurb}</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Stat label="Sites" value={list.length} />
        <Stat label="Capacity" value={fmtBpd(total)} sub="bbl/d" />
        <Stat label="Of US" value={fmtPct((total / US_CAPACITY_BPD) * 100, 0)} />
      </div>

      <div className="mt-6 font-mono text-[9.5px] uppercase tracking-[0.2em] text-mist-faint">Largest in the selection</div>
      <ul className="mt-2 divide-y divide-navy/[0.06]">
        {list.slice(0, 5).map((r) => (
          <li key={r.id}>
            <button type="button" onClick={() => onSelect(r.id)} className="group flex w-full items-center justify-between gap-3 py-2.5 text-left">
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium text-mist group-hover:text-gold-deep">{r.name}</span>
                <span className="block text-[11px] text-mist-faint">
                  {r.operator} · {r.city}, {r.state}
                </span>
              </span>
              <span className="flex-none font-mono text-[11px] tabular-nums text-mist-dim">{fmtInt(r.capacity)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CollectionCard({ title, blurb, list, tag, onOpen, delay }) {
  const total = list.reduce((s, r) => s + r.capacity, 0)
  const avgPrice = list.reduce((s, r) => s + r.price * r.capacity, 0) / Math.max(total, 1)
  const share = (total / US_CAPACITY_BPD) * 100
  return (
    <motion.div {...fade(delay)} className={`${glass} group relative flex flex-col overflow-hidden p-6`}>
      <div className="breathe pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-gold/[0.14] blur-[60px]" />
      <div className="relative flex items-start justify-between gap-3">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-gold-deep">{tag}</span>
        <PreviewTag />
      </div>
      <h3 className="relative mt-3 font-serif text-2xl font-semibold leading-tight text-mist">{title}</h3>
      <p className="relative mt-2 text-[13px] leading-relaxed text-mist-dim">{blurb}</p>

      <div className="relative mt-5 grid grid-cols-3 gap-3">
        <Stat label="Sites" value={list.length} />
        <Stat label="bbl/d" value={fmtBpd(total)} />
        <Stat label="Of US" value={fmtPct(share, 0)} />
      </div>
      <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-navy/[0.07]">
        <div className="h-full rounded-full bg-gradient-to-r from-gold-deep/70 to-gold" style={{ width: `${Math.max(share, 1.5)}%` }} />
      </div>

      <div className="relative mt-auto flex items-end justify-between gap-3 pt-6">
        <div>
          <div className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-mist-faint">Bundle · illustrative</div>
          <div className="font-display text-xl font-semibold tabular-nums text-mist">
            {fmtUsd(avgPrice)} <span className="text-[12px] font-medium text-mist-faint">/ token</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <PreviewButton primary>Reserve</PreviewButton>
          <button type="button" onClick={onOpen} className="text-[11px] font-medium text-gold-deep underline decoration-gold/50 underline-offset-4 hover:decoration-gold-deep">
            View on map
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function ListingCard({ r, selected, onOpen, index }) {
  return (
    <motion.article
      {...fade(Math.min(index, 5) * 0.05)}
      className={`card group relative flex flex-col p-5 transition-shadow hover:shadow-[0_18px_40px_-22px_rgba(23,23,43,0.3)] ${selected ? 'ring-2 ring-gold' : ''}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-sm bg-ink-850 px-2 py-1 font-mono text-[10px] font-medium tracking-[0.12em] text-mist">{r.ticker}</span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-mist-faint">{regionName(r.region)}</span>
      </div>
      <h3 className="mt-4 font-serif text-xl font-semibold leading-tight text-mist">{r.name}</h3>
      <p className="mt-1 text-[12.5px] text-mist-dim">
        {r.operator} · {r.city}, {r.state}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <dt className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-mist-faint">Capacity</dt>
          <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums text-mist">
            {fmtInt(r.capacity)} <span className="text-[11px] font-medium text-mist-faint">bbl/d</span>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-mist-faint">Token price</dt>
          <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums text-mist">
            {fmtUsd(r.price)} <span className="text-[11px] font-medium text-mist-faint">illustrative</span>
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <div className="h-1 overflow-hidden rounded-full bg-navy/[0.07]">
          <div className="h-full rounded-full bg-gold" style={{ width: `${r.placed}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[9.5px] uppercase tracking-[0.16em] text-mist-faint">
          <span>Placed in preview</span>
          <span className="tabular-nums">{r.placed}%</span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 pt-1">
        <PreviewButton primary className="flex-1">
          Buy
        </PreviewButton>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex flex-1 items-center justify-center rounded-sm border border-navy/15 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-mist transition-colors hover:border-gold hover:text-gold-deep"
        >
          On the map
        </button>
      </div>
    </motion.article>
  )
}

// #/marketplace/<site id> opens the page on that refinery
function selectionFromHash() {
  const id = window.location.hash.split('/')[2] || ''
  return BY_ID[id] ? id : null
}

function writeHash(id) {
  const next = id ? `#/marketplace/${id}` : '#/marketplace'
  if (window.location.hash !== next) window.history.replaceState(null, '', next)
}

const STEPS = [
  {
    num: 'I',
    title: 'Capacity becomes tokens',
    body: 'A refinery is listed with one token for every barrel per day it can process. Six hundred thousand barrels, six hundred thousand tokens, held by whoever buys them.',
  },
  {
    num: 'II',
    title: 'Tokens trade around the clock',
    body: 'Listings settle on Solana in USDC. Buy a slice of one plant, or a bundle that spans a whole region, in the same wallet that holds your XTO.',
  },
  {
    num: 'III',
    title: 'Holders are paid by the barrel',
    body: 'The idea on the table: throughput pays holders, the way XTO trading fees pay holders today. How, and whether, that works is exactly what this preview exists to explore.',
  },
]

export default function MarketplacePage() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(selectionFromHash)
  const [hovered, setHovered] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const mapRef = useRef(null)

  const listings = useMemo(() => REFINERIES.filter((r) => inFilter(r, filter)), [filter])
  const visible = showAll ? listings : listings.slice(0, INITIAL_LISTINGS)
  const selectedRef = selected ? BY_ID[selected] : null

  const pickRegion = (key) => {
    setFilter((f) => (f === key ? 'all' : key))
    setSelected(null)
    setShowAll(false)
  }
  const openOnMap = (id) => {
    setSelected(id)
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const openFilterOnMap = (key) => {
    setFilter(key)
    setSelected(null)
    setShowAll(false)
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // deselect a refinery that the filter just hid
  useEffect(() => {
    if (selectedRef && !inFilter(selectedRef, filter)) setSelected(null)
  }, [filter, selectedRef])

  // keep the address bar on the selected site, so the view can be shared
  useEffect(() => {
    writeHash(selected)
  }, [selected])

  const totalCapacity = REFINERIES.reduce((s, r) => s + r.capacity, 0)

  return (
    <div className="relative overflow-hidden bg-paper pt-16">
      {/* the preview strip: the first thing on the page says what it is */}
      <div className="relative border-b border-brass/20 bg-brass/[0.07]">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-6 py-2.5 text-center">
          <LockIcon className="h-3 w-3 flex-none text-brass" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
            Design preview · nothing here is live or for sale · listings are placeholders
          </p>
        </div>
      </div>

      <div className="breathe pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gold-deep/[0.12] blur-[140px]" />

      {/* title */}
      <div className="relative mx-auto max-w-3xl px-6 pb-12 pt-14 text-center sm:pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
          <p className="eyebrow mb-6 justify-center">
            <OilMark className="h-3.5 w-3.5" strokeWidth={5} />
            Marketplace
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.015em] sm:text-6xl">
            A marketplace for <span className="text-shimmer">American refining</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-mist-dim sm:text-lg">
            Browse the plants that turn crude into the fuel this country runs on, grouped by region, and see how a
            tokenized slice of their capacity could one day trade next to your XTO.
          </p>
          <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint">
            <span>{REFINERIES.length} sites</span>
            <span className="hidden h-3 w-px bg-navy/15 sm:block" />
            <span>{fmtBpd(totalCapacity)} bbl/d listed</span>
            <span className="hidden h-3 w-px bg-navy/15 sm:block" />
            <span>{REGIONS.length} regions</span>
          </div>
        </motion.div>
      </div>

      {/* the map */}
      <div ref={mapRef} id="market-map" className="relative mx-auto max-w-7xl px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8, ease: EASE }} className={`${glass} overflow-hidden`}>
          {/* region chips */}
          <div className="flex gap-2 overflow-x-auto border-b border-navy/[0.07] px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
            {[{ key: 'all', name: 'All regions' }, ...REGIONS, { key: 'top', name: 'Ten largest' }].map((r) => {
              const on = filter === r.key
              const count = REFINERIES.filter((x) => inFilter(x, r.key)).length
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => pickRegion(r.key)}
                  className={`flex flex-none items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                    on ? 'bg-mist text-paper' : 'bg-navy/[0.04] text-mist-dim hover:bg-navy/[0.08] hover:text-mist'
                  }`}
                >
                  {r.name}
                  <span className={`font-mono text-[10px] tabular-nums ${on ? 'text-paper/60' : 'text-mist-faint'}`}>{count}</span>
                </button>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-[1.55fr_1fr]">
            <div className="relative p-4 sm:p-6 lg:border-r lg:border-navy/[0.07]">
              <UsMap filter={filter} selected={selected} hovered={hovered} onHover={setHovered} onSelect={setSelected} onRegion={pickRegion} />
            </div>
            <div className="relative border-t border-navy/[0.07] p-6 lg:border-t-0 lg:p-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected || `region:${filter}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  {selectedRef ? <RefineryDetail refinery={selectedRef} onBack={() => setSelected(null)} /> : <RegionDetail filter={filter} onSelect={setSelected} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* collections */}
      <section className="relative border-t border-navy/[0.07] bg-ink-850/40">
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="max-w-2xl">
            <motion.p {...fade()} className="eyebrow">
              Collections
            </motion.p>
            <motion.h2 {...fade(0.08)} className="mt-6 font-serif text-3xl font-semibold leading-[1.1] tracking-[-0.015em] sm:text-5xl">
              Buy a region, not a refinery.
            </motion.h2>
            <motion.p {...fade(0.16)} className="mt-5 text-[15px] leading-relaxed text-mist-dim sm:text-lg">
              Bundles that spread one position across every plant in a district. The weights follow capacity, so the
              biggest plants carry the most.
            </motion.p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {REGIONS.map((r, i) => (
              <CollectionCard
                key={r.key}
                tag={`PADD ${r.padd}`}
                title={r.name}
                blurb={r.blurb}
                list={REFINERIES.filter((x) => x.region === r.key)}
                onOpen={() => openFilterOnMap(r.key)}
                delay={0.05 * i}
              />
            ))}
            <CollectionCard
              tag="Curated"
              title="America's Ten Largest"
              blurb={`The ten biggest plants in the country in one basket, ${TOP_TEN_GULF} of them on the Gulf Coast.`}
              list={REFINERIES.filter((x) => TOP_TEN.has(x.id))}
              onOpen={() => openFilterOnMap('top')}
              delay={0.25}
            />
          </div>
        </div>
      </section>

      {/* listings */}
      <section className="relative border-t border-navy/[0.07]">
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <motion.p {...fade()} className="eyebrow">
                Listings
              </motion.p>
              <motion.h2 {...fade(0.08)} className="mt-6 font-serif text-3xl font-semibold leading-[1.1] tracking-[-0.015em] sm:text-5xl">
                {filter === 'all' ? 'Every plant on the map.' : filter === 'top' ? 'The ten largest.' : `${regionName(filter)}.`}
              </motion.h2>
            </div>
            <motion.div {...fade(0.12)} className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint">
              {listings.length} sites · sorted by capacity
              {filter !== 'all' && (
                <>
                  {' · '}
                  <button type="button" onClick={() => pickRegion(filter)} className="text-gold-deep underline decoration-gold/50 underline-offset-4 hover:decoration-gold-deep">
                    show all
                  </button>
                </>
              )}
            </motion.div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((r, i) => (
              <ListingCard key={r.id} r={r} index={i} selected={r.id === selected} onOpen={() => openOnMap(r.id)} />
            ))}
          </div>
          {listings.length > INITIAL_LISTINGS && (
            <div className="mt-10 text-center">
              <button type="button" onClick={() => setShowAll((s) => !s)} className="btn-secondary">
                {showAll ? 'Show fewer' : `Show all ${listings.length}`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* how it would work */}
      <section className="relative border-t border-navy/[0.07] bg-ink-850/40">
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <motion.p {...fade()} className="eyebrow">
                How it would work
              </motion.p>
              <motion.h2 {...fade(0.08)} className="mt-6 font-serif text-3xl font-semibold leading-[1.1] tracking-[-0.015em] sm:text-5xl">
                A barrel a day, a token in your wallet.
              </motion.h2>
            </div>
            <motion.div {...fade(0.12)}>
              <PreviewTag />
            </motion.div>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div key={s.num} {...fade(0.1 + i * 0.1)} className="card p-8">
                <span className="font-serif text-3xl text-gold">{s.num}</span>
                <h3 className="mt-5 font-serif text-2xl font-semibold text-mist">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-mist-dim">{s.body}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fade(0.3)} className="mt-8 max-w-3xl text-xs leading-relaxed text-mist-faint">
            A concept, not a roadmap. Whether any of this ships, and in what form, has not been decided.
          </motion.p>
        </div>
      </section>

      {/* the fine print, said plainly */}
      <section className="relative border-t border-navy/[0.07]">
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className={`${glass} p-6 sm:p-8`}>
            <div className="flex items-center gap-3">
              <LockIcon className="h-4 w-4 text-brass" />
              <h2 className="font-serif text-xl font-semibold text-mist">What this page is, and is not</h2>
            </div>
            <div className="mt-5 grid gap-6 text-[13px] leading-relaxed text-mist-dim md:grid-cols-3">
              <p>
                <span className="font-semibold text-mist">It is a design preview.</span> No listing is live, no button does anything,
                and nothing on this page can be bought, reserved or traded.
              </p>
              <p>
                <span className="font-semibold text-mist">The refineries are real; the listings are not.</span> They are named only to make
                the preview look like the real thing. Capacities are approximate public figures. Prices, tokens and percentages are made up.
              </p>
              <p>
                <span className="font-semibold text-mist">XTO has no relationship with any of them.</span> The operators named here have no
                connection to XTO, have not agreed to anything, and own and run their plants exactly as they did before this page existed.
                Nothing here is an offer or financial advice.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
