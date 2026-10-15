import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { OilMark } from '../Hero.jsx'
import {
  BY_ID,
  LockIcon,
  EASE,
  OrderTicket,
  PreviewButton,
  PreviewStrip,
  PreviewTag,
  REFINERIES,
  REGIONS,
  REGION_BY_KEY,
  Stat,
  TOP_TEN,
  TOP_TEN_GULF,
  US_CAPACITY_BPD,
  UsMap,
  fade,
  fmtBpd,
  fmtInt,
  fmtPct,
  fmtUsd,
  glass,
  inFilter,
  regionName,
  sitePath,
} from './shared.jsx'

// A design preview of a marketplace for tokenized refining capacity. Nothing here works on
// purpose: every action is disabled, every price is illustrative, and the listings are real
// US refineries used as placeholders (see scripts/refineries.mjs). XTO has no relationship
// with any of them. The map and its coordinates are pre-projected at build time (npm run map).
// The data, the map and the preview widgets live in ./shared.jsx, shared with RefineryPage.

const INITIAL_LISTINGS = 12


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

      <a
        href={sitePath(refinery.id)}
        className="mt-6 inline-flex w-full items-center justify-center rounded-sm bg-mist px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-gold-deep"
      >
        View more
      </a>
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
        <a
          href={sitePath(r.id)}
          className="inline-flex flex-1 items-center justify-center rounded-sm bg-mist px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-gold-deep"
        >
          View more
        </a>
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
      <PreviewStrip />

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
