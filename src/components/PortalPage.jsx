import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OilMark } from './Hero.jsx'

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
    ago: i === 0 ? 'Just now' : `${i}h ago`,
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
  const H = 200
  const L = 10
  const R = 56
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
          <stop offset="0%" stopColor="#32E7D0" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#32E7D0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.33, 0.66, 1].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(max * g)} y2={y(max * g)} stroke="#FFFFFF" strokeOpacity="0.07" />
          <text x={W - R + 8} y={y(max * g) + 3.5} fill="#8685A8" fontSize="10" fontFamily="Inter">
            {num(max * g, max < 100 ? 1 : 0)}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#pArea)" />
      <path d={line} fill="none" stroke="#32E7D0" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r="4" fill="#32E7D0" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r="8" fill="#32E7D0" fillOpacity="0.25">
        <animate attributeName="r" values="6;11;6" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function Countdown() {
  // start from a random point in the hour so every visit looks live
  const [next, setNext] = useState(() => 180 + Math.floor(Math.random() * 3240))
  useEffect(() => {
    const iv = setInterval(() => setNext((s) => (s > 0 ? s - 1 : 3600)), 1000)
    return () => clearInterval(iv)
  }, [])
  const mm = String(Math.floor(next / 60)).padStart(2, '0')
  const ss = String(next % 60).padStart(2, '0')
  return <span className="tabular-nums">{mm}:{ss}</span>
}

// clean fintech card: white, hairline ring, one soft shadow, no blur stack
const glass =
  'rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] shadow-[0_16px_40px_-28px_rgba(0,0,0,0.7)]'

// the one dark surface: deep night with a quiet aqua bloom in the corner
const night = {
  background:
    'linear-gradient(135deg, #1D1D3E 0%, #17172B 55%, #141430 100%)',
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
    <div className="space-y-5">
      <div className="flex justify-end">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-medium text-mist-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-[#32E7D0]" />
          {sample ? 'Sample account — enter your wallet above' : 'Illustrative preview — live data connects at launch'}
        </span>
      </div>

      {/* account balance card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 ring-1 ring-white/[0.08] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.7)] sm:p-9"
        style={night}
      >
        <div className="breathe pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#32E7D0]/[0.14] blur-[80px]" />

        <div className="relative flex items-start justify-between">
          <span className="text-[13px] font-medium tracking-wide text-white/50">Total balance</span>
          <span className="flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-1.5 text-[12px] font-semibold text-[#7CF5E6]">
            <OilMark className="h-3.5 w-3.5" strokeWidth={5} />
            XTO
          </span>
        </div>

        <div className="relative mt-3 font-display text-4xl font-semibold tabular-nums tracking-[-0.025em] text-white sm:text-6xl lg:text-7xl">
          {usd(positionUsd)}
        </div>
        <div className="relative mt-2.5 font-display text-[15px] font-medium tabular-nums tracking-[-0.01em] text-white/55 sm:text-[16px]">
          {data.balance.toLocaleString('en-US')} XTO · {(data.share * 100).toFixed(4)}% of supply
        </div>

        <div className="relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-mono text-[12px] tracking-wide text-[#7CF5E6]/70">
            {address.slice(0, 6)}····{address.slice(-4)}
          </span>
          <span className="text-[12px] text-white/35">Read-only · Updates hourly</span>
        </div>
      </div>

      {/* stat tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: '$USO earned, all time',
            value: usd(data.allTimeXrp * XRP_PRICE),
            sub: 'worth of $USO, paid to this wallet',
          },
          {
            label: 'Last 30 days',
            value: usd(data.totalXrp * XRP_PRICE),
            sub: 'worth of $USO',
          },
          {
            label: 'Estimated daily pace',
            value: `${usd(data.estDailyUsd)} / day`,
            sub: 'worth of $USO, at current volume',
          },
        ].map((k) => (
          <div key={k.label} className={`${glass} p-6`}>
            <span className="block text-[13px] font-medium text-mist-faint">{k.label}</span>
            <span className="mt-1.5 block font-display text-[26px] font-semibold tabular-nums tracking-[-0.02em] text-mist">
              {k.value}
            </span>
            <span className="mt-0.5 block text-[13px] tabular-nums text-mist-faint">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* earnings chart + side column */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className={`${glass} p-6 lg:col-span-2 sm:p-7`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-[16px] font-semibold text-mist">Earnings</h3>
              <span className="text-[13px] text-mist-faint">Cumulative $USO received</span>
            </div>
            <div className="flex overflow-hidden rounded-full bg-white/[0.06] p-1 ring-1 ring-white/[0.08]">
              {[7, 30].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${
                    range === r ? 'bg-gold text-ink-950 shadow-sm' : 'text-mist-dim hover:text-mist'
                  }`}
                >
                  {r}D
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-[32px] font-semibold tabular-nums tracking-[-0.02em] text-mist">
              {usd(rangeXrp * XRP_PRICE)}
            </span>
            <span className="font-display text-[16px] font-medium tabular-nums text-mist-faint">
              worth of $USO
            </span>
          </div>
          <div className="mt-2">
            <AreaChart points={cumulative} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div
            className="relative overflow-hidden rounded-2xl p-6 ring-1 ring-white/[0.08] shadow-[0_20px_44px_-24px_rgba(0,0,0,0.7)]"
            style={night}
          >
            <div className="breathe pointer-events-none absolute -right-16 -bottom-20 h-48 w-48 rounded-full bg-[#32E7D0]/[0.14] blur-[70px]" />
            <span className="relative text-[13px] font-medium text-white/50">Next payout</span>
            <div className="relative mt-2 font-display text-[40px] font-semibold tracking-[-0.02em] text-white">
              <Countdown />
            </div>
            <div className="relative mt-1.5 font-display text-[15px] font-medium text-[#7CF5E6]">
              est. +{usd(hourly * XRP_PRICE, 2)} of $USO to this wallet
            </div>
            <p className="relative mt-3 text-[12px] leading-relaxed text-white/40">
              Deposited automatically. Nothing to claim.
            </p>
          </div>

          <div className={`${glass} flex-1 p-6`}>
            <h3 className="font-display text-[16px] font-semibold text-mist">Earning pace</h3>
            <span className="text-[13px] text-mist-faint">At $10M average daily volume</span>
            <div className="mt-4 space-y-3">
              {[
                ['Hourly', hourly, 2],
                ['Daily', data.estDailyUsd / XRP_PRICE, 1],
                ['Monthly', (data.estDailyUsd / XRP_PRICE) * 30, 0],
              ].map(([label, v, d]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-white/[0.08] pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-[14px] text-mist-dim">{label}</span>
                  <span className="text-right">
                    <span className="block font-display text-[16px] font-semibold tabular-nums tracking-[-0.01em] text-mist">
                      +{usd(v * XRP_PRICE, d === 2 ? 2 : 0)}
                    </span>
                    <span className="block text-[12px] tabular-nums text-mist-faint">
                      of $USO
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* transactions, bank-statement style */}
      <div className={`${glass} overflow-hidden`}>
        <div className="flex items-center justify-between px-6 pb-2 pt-5 sm:px-7">
          <h3 className="font-display text-[16px] font-semibold text-mist">Recent payouts</h3>
          <span className="text-[13px] font-medium text-gold-deep">Hourly · Automatic</span>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {data.txs.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.03] sm:px-7"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gold/[0.1] text-[#7CF5E6] ring-1 ring-gold/[0.25]">
                <OilMark className="h-[18px] w-[18px]" strokeWidth={5} />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-mist">XTO Reward</span>
                <span className="block text-[13px] text-mist-faint">Hourly payout · {t.ago}</span>
              </div>
              <div className="text-right">
                <span className="block font-display text-[16px] font-semibold tabular-nums tracking-[-0.01em] text-[#32E7D0]">
                  +{usd(t.xrp * XRP_PRICE, 2)}
                </span>
                <span className="block text-[12px] tabular-nums text-mist-faint">
                  of $USO
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="max-w-3xl text-xs leading-relaxed text-mist-faint">
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
    <div className="relative overflow-hidden bg-paper pt-16">
      <div className="breathe pointer-events-none absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gold-deep/[0.14] blur-[140px]" />

      {/* centered wallet entry */}
      <div className="relative mx-auto max-w-2xl px-6 pb-12 pt-16 text-center sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-6">Holder Portal</p>
          <h1 className="font-serif text-5xl font-semibold leading-[1.06] tracking-[-0.015em] sm:text-6xl">
            Your money, working.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-mist-dim">
            Enter your Solana wallet and check your XTO position like a bank
            account: balance, every payout, and your earning pace. Pin it.
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
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-0 sm:overflow-hidden sm:rounded-full sm:border sm:border-navy/15 sm:bg-ink-850 sm:shadow-xl sm:shadow-navy/15 sm:focus-within:border-gold/50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Solana wallet address"
              spellCheck="false"
              className="w-full rounded-full border border-navy/15 bg-ink-850 px-6 py-4 text-center font-mono text-sm text-mist placeholder:text-mist-faint focus:border-gold/50 focus:outline-none sm:rounded-none sm:border-0 sm:bg-transparent"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-full bg-navy px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-blue sm:rounded-none sm:py-0"
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
      <div className="relative mx-auto max-w-6xl px-6 pb-24">
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
