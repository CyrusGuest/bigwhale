import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XrpMark } from './Hero.jsx'

const TOTAL_SUPPLY = 1_000_000_000
const HOLDER_SHARE = 0.04
const AVG_DAILY_VOLUME = 10_000_000
const XRP_PRICE = 1.34
const TOKEN_PRICE = 0.005 // $5M mcap / 1B supply

const SOL_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
const SAMPLE_ADDRESS = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'

// Deterministic sample data per address until the live Solana + distribution
// APIs are wired in: replace fetchHolderData with real RPC + indexer calls.
function seedFrom(str) {
  let h = 2166136261
  for (const c of str) {
    h ^= c.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const HEXC = '0123456789ABCDEF'

function fetchHolderData(address) {
  const rng = mulberry32(seedFrom(address))
  const balance = Math.round(200_000 + rng() * 19_800_000)
  const share = balance / TOTAL_SUPPLY

  let vol = AVG_DAILY_VOLUME * (0.7 + rng() * 0.6)
  const days = Array.from({ length: 30 }, (_, i) => {
    vol = Math.max(1_500_000, Math.min(22_000_000, vol * (0.82 + rng() * 0.4)))
    const usd = vol * HOLDER_SHARE * share
    return { day: i, usd, xrp: usd / XRP_PRICE }
  })

  const totalXrp = days.reduce((s, d) => s + d.xrp, 0)
  const estDailyUsd = AVG_DAILY_VOLUME * HOLDER_SHARE * share
  const allTimeXrp = totalXrp * (2.4 + rng() * 1.8)

  const hourlyBase = days[29].xrp / 24
  const txs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    hash: `${Array.from({ length: 4 }, () => HEXC[Math.floor(rng() * 16)]).join('')}…${Array.from(
      { length: 4 },
      () => HEXC[Math.floor(rng() * 16)],
    ).join('')}`,
    ago: i === 0 ? 'This hour' : `${i}h ago`,
    xrp: hourlyBase * (0.7 + rng() * 0.6),
  }))

  return { balance, share, days, totalXrp, estDailyUsd, allTimeXrp, txs }
}

const usd = (n, d = 0) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: d })
const num = (n, d = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

function AreaChart({ points }) {
  const W = 620
  const H = 210
  const L = 10
  const R = 58
  const T = 14
  const B = 22
  const max = Math.max(...points, 1)
  const step = (W - L - R) / (points.length - 1)
  const x = (i) => L + i * step
  const y = (v) => H - B - (v / max) * (H - T - B)
  const line = points.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const area = `${line} L${x(points.length - 1)},${H - B} L${L},${H - B} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      <defs>
        <linearGradient id="pArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E9BFF" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#2E9BFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(max * g)} y2={y(max * g)} stroke="#ffffff" strokeOpacity="0.05" />
          <text x={W - R + 8} y={y(max * g) + 3.5} fill="#606D89" fontSize="10" fontFamily="IBM Plex Mono, monospace">
            {num(max * g, max < 100 ? 1 : 0)}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#pArea)" />
      <path d={line} fill="none" stroke="#2E9BFF" strokeWidth="2.2" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r="4" fill="#2E9BFF" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r="8" fill="#2E9BFF" fillOpacity="0.25">
        <animate attributeName="r" values="6;11;6" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function BarChart({ points }) {
  const W = 620
  const H = 150
  const P = 8
  const max = Math.max(...points, 1)
  const bw = (W - P * 2) / points.length
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      <defs>
        <linearGradient id="pBar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E9BFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2E9BFF" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      {points.map((v, i) => {
        const h = Math.max((v / max) * (H - P * 2), 2)
        const last = i === points.length - 1
        return (
          <rect
            key={i}
            x={P + i * bw + bw * 0.2}
            y={H - P - h}
            width={bw * 0.6}
            height={h}
            rx="2"
            fill={last ? '#66B8FF' : 'url(#pBar)'}
          />
        )
      })}
    </svg>
  )
}

function Countdown() {
  const [next, setNext] = useState(2148)
  useEffect(() => {
    const iv = setInterval(() => setNext((s) => (s > 0 ? s - 1 : 3600)), 1000)
    return () => clearInterval(iv)
  }, [])
  const mm = String(Math.floor(next / 60)).padStart(2, '0')
  const ss = String(next % 60).padStart(2, '0')
  return <span className="tabular-nums">{mm}:{ss}</span>
}

function Dashboard({ address, data, sample = false }) {
  const [range, setRange] = useState(30)
  const days = data.days.slice(30 - range)
  const cumulative = days.reduce((acc, d) => {
    acc.push((acc[acc.length - 1] || 0) + d.xrp)
    return acc
  }, [])
  const rangeXrp = cumulative[cumulative.length - 1]
  const positionUsd = data.balance * TOKEN_PRICE
  const hourly = data.estDailyUsd / 24 / XRP_PRICE

  return (
    <div>
      {/* identity bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-azure/40 bg-ink-900 text-azure">
            <XrpMark className="h-5 w-5" strokeWidth={4} />
          </span>
          <div>
            <span className="block font-mono text-sm text-mist">
              {address.slice(0, 6)}…{address.slice(-6)}
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint">
              Tracking · Read-only · Updates hourly
            </span>
          </div>
        </div>
        <span className="rounded-full border border-brass/40 bg-brass/[0.06] px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
          {sample ? 'Sample wallet, enter yours above' : 'Illustrative preview, live data connects at launch'}
        </span>
      </div>

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: 'XPY balance',
            value: data.balance.toLocaleString('en-US'),
            sub: `${(data.share * 100).toFixed(4)}% of supply`,
            hot: true,
          },
          {
            label: 'Position value',
            value: usd(positionUsd),
            sub: `at $${TOKEN_PRICE.toFixed(3)} / XPY`,
          },
          {
            label: 'XRP earned, all time',
            value: num(data.allTimeXrp, 1),
            sub: `≈ ${usd(data.allTimeXrp * XRP_PRICE)}`,
          },
          {
            label: 'Last 30 days',
            value: `${num(data.totalXrp, 1)} XRP`,
            sub: `≈ ${usd(data.totalXrp * XRP_PRICE)}`,
          },
          {
            label: 'Est. daily pace',
            value: `${num(data.estDailyUsd / XRP_PRICE, 1)} XRP`,
            sub: `≈ ${usd(data.estDailyUsd)} / day`,
          },
        ].map((k) => (
          <div
            key={k.label}
            className={`rounded-lg p-5 ${
              k.hot
                ? 'border border-azure/35 bg-azure-deep/[0.12]'
                : 'border border-white/[0.06] bg-white/[0.03]'
            }`}
          >
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-mist-faint">
              {k.label}
            </span>
            <span className="mt-2 block text-xl font-semibold tabular-nums tracking-tight text-mist">
              {k.value}
            </span>
            <span className="mt-1 block font-mono text-[11px] text-mist-faint">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* main grid */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* earnings chart */}
        <div className="panel rounded-lg p-6 lg:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-medium text-mist">XRP earned</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mist-faint">
                Cumulative · {range} days
              </span>
            </div>
            <div className="flex overflow-hidden rounded-full border border-white/10">
              {[7, 30].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-4 py-1.5 font-mono text-[11px] transition-colors ${
                    range === r ? 'bg-mist text-ink-950' : 'text-mist-dim hover:text-mist'
                  }`}
                >
                  {r}D
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-semibold tabular-nums tracking-tight text-mist">
              {num(rangeXrp, 1)} XRP
            </span>
            <span className="font-mono text-sm text-azure-bright">
              ≈ {usd(rangeXrp * XRP_PRICE)}
            </span>
          </div>
          <div className="mt-2">
            <AreaChart points={cumulative} />
          </div>
        </div>

        {/* side column */}
        <div className="flex flex-col gap-5">
          <div className="rounded-lg border border-azure/35 bg-azure-deep/[0.12] p-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-azure-bright">
              Next distribution
            </span>
            <div className="mt-2 font-mono text-4xl font-medium text-mist">
              <Countdown />
            </div>
            <div className="mt-2 font-mono text-sm text-azure-bright">
              est. +{num(hourly, 2)} XRP to this wallet
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-mist-faint">
              Paid automatically. Nothing to claim.
            </p>
          </div>

          <div className="panel flex-1 rounded-lg p-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-mist-faint">
              Earning pace at avg volume
            </span>
            <div className="mt-4 space-y-3.5">
              {[
                ['Hourly', hourly, 2],
                ['Daily', data.estDailyUsd / XRP_PRICE, 1],
                ['Monthly', (data.estDailyUsd / XRP_PRICE) * 30, 0],
              ].map(([label, v, d]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between border-b border-white/[0.05] pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm text-mist-dim">{label}</span>
                  <span className="text-right">
                    <span className="block font-mono text-sm tabular-nums text-mist">
                      +{num(v, d)} XRP
                    </span>
                    <span className="block font-mono text-[10px] tabular-nums text-mist-faint">
                      ≈ {usd(v * XRP_PRICE)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* bottom grid */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="panel rounded-lg p-6">
          <h3 className="text-[13px] font-medium text-mist">Daily payouts</h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mist-faint">
            XRP / day · {range} days
          </span>
          <div className="mt-4">
            <BarChart points={days.map((d) => d.xrp)} />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-mist-faint">
            <span>{range}d ago</span>
            <span>today</span>
          </div>
        </div>

        <div className="panel rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-medium text-mist">Distribution ledger</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mist-faint">
              Hourly · Newest first
            </span>
          </div>
          <div className="mt-4 divide-y divide-white/[0.04]">
            {data.txs.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 py-2.5 font-mono text-xs sm:gap-4"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-azure/10 text-azure">
                  <XrpMark className="h-3 w-3" strokeWidth={5} />
                </span>
                <span className="truncate text-mist-dim">{t.hash}</span>
                <span className="whitespace-nowrap text-mist-faint">{t.ago}</span>
                <span className="text-right">
                  <span className="block tabular-nums font-medium text-azure">
                    +{num(t.xrp, 2)} XRP
                  </span>
                  <span className="block tabular-nums text-[10px] text-mist-faint">
                    ≈ {usd(t.xrp * XRP_PRICE, 2)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-xs leading-relaxed text-mist-faint">
        Pace figures apply the current formula to this wallet&rsquo;s share at
        $10M average daily volume. They change the moment volume does, and are
        not a promise. Future payouts may be higher, lower, or zero.
      </p>
    </div>
  )
}

export default function PortalPage() {
  const [input, setInput] = useState('')
  const [address, setAddress] = useState(null)
  const [error, setError] = useState('')

  const data = useMemo(() => (address ? fetchHolderData(address) : null), [address])
  const sampleData = useMemo(() => fetchHolderData(SAMPLE_ADDRESS), [])

  const submit = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!SOL_ADDRESS.test(trimmed)) {
      setError('That does not look like a valid Solana address (base58, 32-44 characters).')
      return
    }
    setError('')
    setAddress(trimmed)
  }

  return (
    <div className="relative overflow-hidden pt-16">
      <div className="pointer-events-none absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-azure-deep/[0.14] blur-[140px]" />

      {/* centered wallet entry */}
      <div className="relative mx-auto max-w-2xl px-6 pb-14 pt-20 text-center sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-6">Holder Portal</p>
          <h1 className="text-5xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-6xl">
            Your money, working.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-mist-dim">
            Enter your Solana wallet and check your XPY position like a
            portfolio: balance, every payout, and your earning pace. Pin it.
            Check it daily.
          </p>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-9 max-w-xl"
        >
          <div className="flex overflow-hidden rounded-full border border-white/15 bg-ink-850 shadow-2xl shadow-black/40 focus-within:border-azure/50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Solana wallet address"
              spellCheck="false"
              className="w-full bg-transparent px-6 py-4 text-center font-mono text-sm text-mist placeholder:text-mist-faint focus:outline-none"
            />
            <button
              type="submit"
              className="whitespace-nowrap bg-azure px-7 text-sm font-semibold text-white transition-colors hover:bg-azure-bright"
            >
              Track Wallet
            </button>
          </div>
          {error && <p className="mt-3 text-xs text-brass">{error}</p>}
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-mist-faint">
            Read-only lookup · Never asks you to connect or sign
          </p>
        </motion.form>
      </div>

      {/* dashboard */}
      <div className="relative mx-auto max-w-7xl px-6 pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={address || 'sample'}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Dashboard
              address={address || SAMPLE_ADDRESS}
              data={data || sampleData}
              sample={!address}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
