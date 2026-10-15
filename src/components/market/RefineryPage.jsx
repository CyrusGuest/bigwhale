import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { OilMark } from '../Hero.jsx'
import {
  BY_ID,
  EASE,
  LockIcon,
  OrderTicket,
  PRODUCTS,
  PreviewStrip,
  PreviewTag,
  REFINERIES,
  REGION_BY_KEY,
  US_CAPACITY_BPD,
  UsMap,
  fade,
  fmtBpd,
  fmtInt,
  fmtPct,
  fmtUsd,
  glass,
  mapPath,
  nearby,
  profile,
  ranks,
  regionName,
  sitePath,
} from './shared.jsx'

// One refinery's page in the marketplace preview. The operator, site, location, capacity and
// the year it first ran are public facts; every other figure on the page is illustrative and
// generated from the site id (see profile() in shared.jsx), and the page says so wherever one
// appears. Nothing here can be bought.

const label = 'font-mono text-[9.5px] uppercase tracking-[0.2em] text-mist-faint'
const fmtMoneyShort = (n) => (n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : fmtUsd(n, 0))

function Tile({ label: l, value, sub, accent = false, delay = 0 }) {
  return (
    <motion.div {...fade(delay)} className={`${glass} relative overflow-hidden p-5 sm:p-6`}>
      {accent && <div className="breathe pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-gold/[0.18] blur-[60px]" />}
      <span className={`relative block ${label}`}>{l}</span>
      <span className="relative mt-2 block font-display text-[24px] font-semibold tabular-nums tracking-[-0.02em] text-mist sm:text-[26px]">{value}</span>
      {sub && <span className="relative mt-0.5 block text-[12.5px] leading-relaxed text-mist-faint">{sub}</span>}
    </motion.div>
  )
}

// two-sided bar: how much of the slate is sour, how much is imported
function SlateBar({ left, right, pct }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[12px] font-medium text-mist">
        <span>
          {left} <span className="font-mono text-[11px] tabular-nums text-mist-faint">{pct}%</span>
        </span>
        <span>
          <span className="font-mono text-[11px] tabular-nums text-mist-faint">{100 - pct}%</span> {right}
        </span>
      </div>
      <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-navy/[0.07]">
        <div className="h-full rounded-l-full bg-gradient-to-r from-gold-deep/70 to-gold" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function YieldBar({ mix }) {
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full">
        {PRODUCTS.map((p) => (
          <div key={p.key} style={{ width: `${mix[p.key]}%`, background: p.color }} title={`${p.label} ${mix[p.key]}%`} />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
        {PRODUCTS.map((p) => (
          <li key={p.key} className="flex items-center gap-2 text-[12px] text-mist-dim">
            <span className="h-2 w-2 flex-none rounded-full" style={{ background: p.color }} />
            {p.label}
            <span className="ml-auto font-mono text-[11px] tabular-nums text-mist">{mix[p.key]}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// twelve months of utilization as bars
function UtilizationChart({ months }) {
  const W = 600
  const H = 150
  const padB = 22
  const gap = 8
  const bw = (W - gap * (months.length - 1)) / months.length
  const y = (v) => (H - padB) * (1 - v / 100)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full text-mist" role="img" aria-label="Illustrative monthly utilization">
      {[50, 75, 100].map((g) => (
        <g key={g}>
          <line x1="0" x2={W} y1={y(g)} y2={y(g)} stroke="currentColor" strokeOpacity="0.08" />
          <text x={W} y={y(g) - 3} textAnchor="end" fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="currentColor" fillOpacity="0.45">
            {g}%
          </text>
        </g>
      ))}
      {months.map((m, i) => {
        const x = i * (bw + gap)
        const low = m.pct < 75
        return (
          <g key={m.month}>
            <motion.rect
              x={x}
              width={bw}
              rx="3"
              fill={low ? '#C8A24A' : '#32E7D0'}
              fillOpacity={low ? 0.85 : 0.9}
              initial={{ y: y(0), height: 0 }}
              whileInView={{ y: y(m.pct), height: H - padB - y(m.pct) }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i, duration: 0.6, ease: EASE }}
            />
            <text x={x + bw / 2} y={H - 6} textAnchor="middle" fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="currentColor" fillOpacity="0.5" letterSpacing="0.5">
              {m.month.toUpperCase()}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// thirty days of the illustrative token price
function PriceChart({ series, up }) {
  const W = 600
  const H = 180
  const pad = { t: 10, b: 20, l: 0, r: 44 }
  const min = Math.min(...series)
  const max = Math.max(...series)
  const span = max - min || 1
  const x = (i) => pad.l + (i / (series.length - 1)) * (W - pad.l - pad.r)
  const y = (v) => pad.t + (1 - (v - min) / span) * (H - pad.t - pad.b)
  const line = series.map((v, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const area = `${line} L ${x(series.length - 1).toFixed(1)} ${H - pad.b} L ${x(0)} ${H - pad.b} Z`
  const color = up ? '#0B8E7D' : '#B31942'
  const last = series[series.length - 1]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full text-mist" role="img" aria-label="Illustrative 30-day token price">
      <defs>
        <linearGradient id="rp-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[min, max].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 4" />
          <text x={W} y={y(v) + 3} textAnchor="end" fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="currentColor" fillOpacity="0.45">
            {fmtUsd(v)}
          </text>
        </g>
      ))}
      <motion.path d={area} fill="url(#rp-area)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }} />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      />
      <circle cx={x(series.length - 1)} cy={y(last)} r="4" fill={color} stroke="#fff" strokeWidth="1.5" />
      <text x={pad.l} y={H - 6} fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="currentColor" fillOpacity="0.45" letterSpacing="1">
        30 DAYS
      </text>
      <text x={W - pad.r} y={H - 6} textAnchor="end" fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="currentColor" fillOpacity="0.45" letterSpacing="1">
        TODAY
      </text>
    </svg>
  )
}

function Fact({ k, v }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-navy/[0.06] py-2.5 last:border-0">
      <span className="text-[12.5px] text-mist-faint">{k}</span>
      <span className="text-right text-[13px] font-medium text-mist">{v}</span>
    </div>
  )
}

function Chip({ children, tone = 'navy' }) {
  const cls = tone === 'gold' ? 'bg-gold/[0.14] text-gold-deep ring-gold/30' : 'bg-navy/[0.04] text-mist-dim ring-navy/[0.08]'
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-medium ring-1 ${cls}`}>{children}</span>
}

function NotFound() {
  return (
    <div className="relative bg-paper pt-16">
      <PreviewStrip />
      <div className="mx-auto max-w-2xl px-6 py-28 text-center">
        <p className="eyebrow justify-center">Marketplace</p>
        <h1 className="mt-6 font-serif text-4xl font-semibold">No such listing.</h1>
        <p className="mt-4 text-mist-dim">The link points at a site that is not on the map.</p>
        <a href="#/marketplace" className="btn-secondary mt-8">
          Back to the marketplace
        </a>
      </div>
    </div>
  )
}

export default function RefineryPage({ id }) {
  const r = BY_ID[id]
  const [hovered, setHovered] = useState(null)
  const p = useMemo(() => (r ? profile(r) : null), [r])
  if (!r) return <NotFound />

  const region = REGION_BY_KEY[r.region]
  const rank = ranks(r)
  const share = (r.capacity / US_CAPACITY_BPD) * 100
  const up = p.change30 >= 0
  const near = nearby(r)
  const yearsRunning = new Date().getFullYear() - r.since
  const impliedYield = (p.distPerToken / r.price) * 100

  return (
    <div className="relative overflow-hidden bg-paper pt-16">
      <PreviewStrip />
      <div className="breathe pointer-events-none absolute -top-32 right-[-200px] h-[560px] w-[760px] rounded-full bg-gold/[0.12] blur-[140px]" />

      {/* header: the name, and where it is */}
      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-10 sm:pt-14">
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint" aria-label="Breadcrumb">
          <a href="#/marketplace" className="transition-colors hover:text-mist">
            Marketplace
          </a>
          <span>/</span>
          <a href={mapPath(r.id)} className="transition-colors hover:text-mist">
            {region.name}
          </a>
          <span>/</span>
          <span className="text-mist">{r.name}</span>
        </motion.nav>

        <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1.25fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="min-w-0">
            <p className="eyebrow">
              <OilMark className="h-3.5 w-3.5" strokeWidth={5} />
              {r.operator} · PADD {region.padd}
            </p>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.015em] sm:text-6xl">{r.name}</h1>
            <p className="mt-4 text-lg text-mist-dim">
              {r.city}, {r.state} · {region.name}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip tone="gold">{r.ticker}</Chip>
              <Chip>Running since {r.since}</Chip>
              <Chip>
                #{rank.national} of {REFINERIES.length} nationally
              </Chip>
              <Chip>
                #{rank.regional} of {rank.regionCount} in the {region.name}
              </Chip>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={mapPath(r.id)} className="btn-secondary !px-5 !py-2.5 text-[12px]">
                See it on the map
              </a>
              <PreviewTag />
            </div>
          </motion.div>

          {/* the site, lit on the map */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8, ease: EASE }} className={`${glass} overflow-hidden`}>
            <div className="flex items-center justify-between border-b border-navy/[0.07] px-5 py-3">
              <span className={label}>Location</span>
              <span className="font-mono text-[10px] tabular-nums text-mist-faint">
                {r.lat.toFixed(2)}°N · {Math.abs(r.lon).toFixed(2)}°W
              </span>
            </div>
            <div className="p-4 sm:p-5">
              <UsMap
                filter={r.region}
                selected={r.id}
                hovered={hovered}
                onHover={setHovered}
                onSelect={(sid) => {
                  if (sid !== r.id) window.location.hash = sitePath(sid)
                }}
                onRegion={() => {}}
                legend={false}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* the headline numbers */}
      <div className="relative mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Tile label="Capacity" value={`${fmtInt(r.capacity)} bbl/d`} sub={`${fmtPct(share, 2)} of US refining`} accent />
          <Tile label="Nameplate tokens" value={fmtBpd(p.supply)} sub="one token per barrel per day" delay={0.05} />
          <Tile label="Years running" value={yearsRunning} sub={`first crude in ${r.since}`} delay={0.1} />
          <Tile label="Complexity" value={p.complexity} sub="Nelson index · illustrative" delay={0.15} />
        </div>
      </div>

      {/* the plant */}
      <section className="relative border-t border-navy/[0.07] bg-ink-850/40">
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="min-w-0">
              <motion.p {...fade()} className="eyebrow">
                The plant
              </motion.p>
              <motion.h2 {...fade(0.08)} className="mt-6 font-serif text-3xl font-semibold leading-[1.1] tracking-[-0.015em] sm:text-5xl">
                What goes in, what comes out.
              </motion.h2>
              <motion.p {...fade(0.16)} className="mt-6 text-[15px] leading-relaxed text-mist-dim sm:text-lg">
                {r.name} is {r.operator}'s plant in {r.city}, {r.state}, with a nameplate capacity of {fmtInt(r.capacity)} barrels of crude a
                day. It has run since {r.since}, and sits in the {region.name} district, where crude arrives mostly from{' '}
                {p.crudeSources.slice(0, -1).join(', ')} and {p.crudeSources[p.crudeSources.length - 1]}.
              </motion.p>
              <motion.p {...fade(0.22)} className="mt-5 leading-relaxed text-mist-dim">
                The capacity, location and age are public facts. The slate, yield, utilization and everything in the token section are
                illustrative, generated for this preview so the page reads like the real thing.
              </motion.p>

              <motion.div {...fade(0.28)} className="mt-8">
                <Fact k="Operator" v={r.operator} />
                <Fact k="Location" v={`${r.city}, ${r.state}`} />
                <Fact k="District" v={`${region.name} (PADD ${region.padd})`} />
                <Fact k="Running since" v={r.since} />
                <Fact k="Processing units" v={`${p.units} · illustrative`} />
                <Fact k="Site" v={`${fmtInt(p.acres)} acres · illustrative`} />
                <Fact k="Workforce" v={`about ${fmtInt(p.employees)} · illustrative`} />
              </motion.div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div {...fade(0.1)} className={`${glass} p-6 sm:col-span-2`}>
                <div className="flex items-center justify-between">
                  <span className={label}>Crude slate</span>
                  <PreviewTag />
                </div>
                <div className="mt-5 space-y-5">
                  <SlateBar left="Sour" right="Sweet" pct={p.sour} />
                  <SlateBar left="Imported" right="Domestic" pct={p.imported} />
                </div>
                <p className="mt-4 text-[12px] leading-relaxed text-mist-faint">
                  Sour crude carries more sulfur and sells cheaper. Plants built to run it, like the big Gulf Coast refineries, earn a wider
                  margin on every barrel.
                </p>
              </motion.div>

              <motion.div {...fade(0.16)} className={`${glass} p-6 sm:col-span-2`}>
                <div className="flex items-center justify-between">
                  <span className={label}>Product yield</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist-faint">per barrel</span>
                </div>
                <div className="mt-5">
                  <YieldBar mix={p.yieldMix} />
                </div>
              </motion.div>

              <motion.div {...fade(0.22)} className={`${glass} p-6`}>
                <span className={label}>3-2-1 crack spread</span>
                <div className="mt-2 font-display text-[26px] font-semibold tabular-nums tracking-[-0.02em] text-mist">{fmtUsd(p.crack)}</div>
                <p className="mt-1 text-[12px] leading-relaxed text-mist-faint">per barrel, illustrative. The gap between three barrels of crude and the two of gasoline plus one of diesel they become.</p>
              </motion.div>

              <motion.div {...fade(0.26)} className={`${glass} p-6`}>
                <span className={label}>Share of district</span>
                <div className="mt-2 font-display text-[26px] font-semibold tabular-nums tracking-[-0.02em] text-mist">
                  {fmtPct((r.capacity / REFINERIES.filter((x) => x.region === r.region).reduce((s, x) => s + x.capacity, 0)) * 100)}
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-mist-faint">
                  of the {region.name} capacity listed here, across {rank.regionCount} sites.
                </p>
              </motion.div>

              <motion.div {...fade(0.3)} className={`${glass} p-6 sm:col-span-2`}>
                <div className="flex items-center justify-between">
                  <span className={label}>Utilization, last 12 months</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist-faint">illustrative</span>
                </div>
                <div className="mt-4">
                  <UtilizationChart months={p.utilization} />
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-mist-faint">
                  Refineries run near flat out and come down for maintenance every few years; the gold bar is that turnaround.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* the token */}
      <section className="relative border-t border-navy/[0.07]">
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <motion.p {...fade()} className="eyebrow">
                The token
              </motion.p>
              <motion.h2 {...fade(0.08)} className="mt-6 font-serif text-3xl font-semibold leading-[1.1] tracking-[-0.015em] sm:text-5xl">
                {r.ticker}, one token per barrel a day.
              </motion.h2>
            </div>
            <motion.p {...fade(0.12)} className="max-w-xs text-[12.5px] leading-relaxed text-mist-faint">
              Every number in this section is made up for the preview. There is no token, no price and no market.
            </motion.p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-5">
              <motion.div {...fade(0.1)} className={`${glass} p-6 sm:p-7`}>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className={label}>Price · illustrative</span>
                    <div className="mt-1 flex items-baseline gap-3">
                      <span className="font-display text-4xl font-semibold tabular-nums tracking-[-0.02em] text-mist">{fmtUsd(r.price)}</span>
                      <span className={`font-mono text-[12px] font-medium tabular-nums ${up ? 'text-gold' : 'text-flag'}`}>
                        {up ? '▲' : '▼'} {fmtPct(Math.abs(p.change30))} 30d
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={label}>Market cap</span>
                    <div className="mt-1 font-display text-xl font-semibold tabular-nums text-mist">{fmtMoneyShort(p.marketCap)}</div>
                  </div>
                </div>
                <div className="mt-6">
                  <PriceChart series={p.price30} up={up} />
                </div>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Tile label="Placed in preview" value={`${p.placed}%`} sub={`${fmtBpd((p.supply * p.placed) / 100)} of ${fmtBpd(p.supply)} tokens`} delay={0.15} />
                <Tile label="24h volume" value={fmtMoneyShort(p.volume24h)} sub="illustrative" delay={0.2} />
                <Tile label="Distribution / token" value={fmtUsd(p.distPerToken)} sub={`per year · ${fmtPct(impliedYield)} on today's price · illustrative`} delay={0.25} />
              </div>
            </div>

            <motion.div {...fade(0.2)} className={`${glass} p-6 sm:p-7`}>
              <div className="flex items-center justify-between">
                <span className={label}>Order</span>
                <PreviewTag />
              </div>
              <h3 className="mt-3 font-serif text-2xl font-semibold text-mist">Trading is not live.</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-mist-dim">
                This is what the ticket would look like. The buttons are locked, the figures are illustrative, and nothing on this page can
                be bought, reserved or traded.
              </p>
              <OrderTicket refinery={r} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* nearby plants */}
      <section className="relative border-t border-navy/[0.07] bg-ink-850/40">
        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <motion.p {...fade()} className="eyebrow">
                Nearby
              </motion.p>
              <motion.h2 {...fade(0.08)} className="mt-6 font-serif text-3xl font-semibold leading-[1.1] tracking-[-0.015em] sm:text-4xl">
                The closest plants on the map.
              </motion.h2>
            </div>
            <motion.a {...fade(0.12)} href="#/marketplace" className="text-[12px] font-medium uppercase tracking-[0.08em] text-gold-deep underline decoration-gold/50 underline-offset-4 hover:decoration-gold-deep">
              All listings
            </motion.a>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {near.map((n, i) => (
              <motion.a key={n.id} {...fade(0.1 + i * 0.08)} href={sitePath(n.id)} className="card group flex flex-col p-6 transition-colors hover:border-gold/50">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-sm bg-ink-850 px-2 py-1 font-mono text-[10px] font-medium tracking-[0.12em] text-mist">{n.ticker}</span>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-mist-faint">{regionName(n.region)}</span>
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold leading-tight text-mist group-hover:text-gold-deep">{n.name}</h3>
                <p className="mt-1 text-[12.5px] text-mist-dim">
                  {n.operator} · {n.city}, {n.state}
                </p>
                <p className="mt-4 font-display text-lg font-semibold tabular-nums text-mist">
                  {fmtInt(n.capacity)} <span className="text-[11px] font-medium text-mist-faint">bbl/d</span>
                </p>
                <span className="mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-gold-deep">View more →</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* the fine print */}
      <section className="relative border-t border-navy/[0.07]">
        <div className="relative mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-start gap-3 text-[12.5px] leading-relaxed text-mist-faint">
            <LockIcon className="mt-0.5 h-4 w-4 flex-none text-brass" />
            <p className="max-w-4xl">
              <span className="font-semibold text-mist">A design preview.</span> {r.operator} owns and runs {r.name}; it has no connection to XTO
              and has agreed to nothing. The operator, site, location, capacity and age are public information. Every other figure on this
              page is illustrative, and nothing here is an offer, a listing or financial advice.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
