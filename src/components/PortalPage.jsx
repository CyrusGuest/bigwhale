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
          <stop offset="0%" stopColor="#2E9BFF" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#2E9BFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.33, 0.66, 1].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(max * g)} y2={y(max * g)} stroke="#ffffff" strokeOpacity="0.05" />
          <text x={W - R + 8} y={y(max * g) + 3.5} fill="#606D89" fontSize="10" fontFamily="Inter">
            {num(max * g, max < 100 ? 1 : 0)}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#pArea)" />
      <path d={line} fill="none" stroke="#2E9BFF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r="4" fill="#2E9BFF" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r="8" fill="#2E9BFF" fillOpacity="0.25">
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

const cardShadow =
  'shadow-[0_14px_34px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.07)]'

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
        <span className="rounded-full border border-brass/40 bg-brass/[0.06] px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
          {sample ? 'Sample account, enter your wallet above' : 'Illustrative preview, live data connects at launch'}
        </span>
      </div>

      {/* account balance card */}
      <div
        className="relative overflow-hidden rounded-3xl p-7 shadow-[0_24px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] sm:p-9"
        style={{
          background:
            'radial-gradient(120% 160% at 10% 0%, rgba(46,155,255,0.35) 0%, rgba(16,42,92,0.9) 42%, #0A1128 100%)',
        }}
      >
        {/* card shine + watermark */}
        <div className="pointer-events-none absolute -left-24 -top-16 h-[160%] w-40 rotate-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <XrpMark
          className="pointer-events-none absolute -right-10 -top-8 h-44 w-44 text-white opacity-[0.07]"
          strokeWidth={3}
        />

        <div className="relative flex items-start justify-between">
          <span className="text-[13px] font-medium text-white/60">Total balance</span>
          <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur">
            <XrpMark className="h-3.5 w-3.5" strokeWidth={5} />
            XPY
          </span>
        </div>

        <div className="relative mt-3 text-5xl font-semibold tabular-nums tracking-tight text-white sm:text-6xl">
          {usd(positionUsd)}
        </div>
        <div className="relative mt-2 text-[15px] font-medium tabular-nums text-white/70">
          {data.balance.toLocaleString('en-US')} XPY · {(data.share * 100).toFixed(4)}% of supply
        </div>

        <div className="relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-mono text-[12px] tracking-wide text-white/50">
            {address.slice(0, 6)}····{address.slice(-4)}
          </span>
          <span className="text-[12px] text-white/40">Read-only · Updates hourly</span>
        </div>
      </div>

      {/* stat tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: 'XRP earned, all time',
            value: `${num(data.allTimeXrp, 1)} XRP`,
            sub: `≈ ${usd(data.allTimeXrp * XRP_PRICE)}`,
          },
          {
            label: 'Last 30 days',
            value: `${num(data.totalXrp, 1)} XRP`,
            sub: `≈ ${usd(data.totalXrp * XRP_PRICE)}`,
          },
          {
            label: 'Estimated daily pace',
            value: `${num(data.estDailyUsd / XRP_PRICE, 1)} XRP`,
            sub: `≈ ${usd(data.estDailyUsd)} per day`,
          },
        ].map((k) => (
          <div key={k.label} className={`rounded-2xl bg-[#141828]/90 p-5 backdrop-blur ${cardShadow}`}>
            <span className="block text-[13px] font-medium text-mist-faint">{k.label}</span>
            <span className="mt-1.5 block text-2xl font-semibold tabular-nums tracking-tight text-mist">
              {k.value}
            </span>
            <span className="mt-0.5 block text-[13px] tabular-nums text-mist-dim">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* earnings chart + side column */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className={`rounded-2xl bg-[#141828]/90 p-6 backdrop-blur lg:col-span-2 ${cardShadow}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold text-mist">Earnings</h3>
              <span className="text-[13px] text-mist-faint">Cumulative XRP received</span>
            </div>
            <div className="flex overflow-hidden rounded-full bg-white/[0.06] p-0.5">
              {[7, 30].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${
                    range === r ? 'bg-azure text-white' : 'text-mist-dim hover:text-mist'
                  }`}
                >
                  {r}D
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-semibold tabular-nums tracking-tight text-mist">
              {num(rangeXrp, 1)} XRP
            </span>
            <span className="text-[15px] font-medium tabular-nums text-mist-dim">
              ≈ {usd(rangeXrp * XRP_PRICE)}
            </span>
          </div>
          <div className="mt-2">
            <AreaChart points={cumulative} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div
            className="relative overflow-hidden rounded-2xl p-6 shadow-[0_14px_34px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]"
            style={{
              background:
                'radial-gradient(130% 140% at 85% 0%, rgba(46,155,255,0.4) 0%, rgba(16,42,92,0.85) 50%, #0C1330 100%)',
            }}
          >
            <span className="text-[13px] font-medium text-white/60">Next payout</span>
            <div className="mt-2 text-4xl font-semibold text-white">
              <Countdown />
            </div>
            <div className="mt-2 text-[14px] font-medium text-azure-bright">
              est. +{num(hourly, 2)} XRP to this wallet
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-white/50">
              Deposited automatically. Nothing to claim.
            </p>
          </div>

          <div className={`flex-1 rounded-2xl bg-[#141828]/90 p-6 backdrop-blur ${cardShadow}`}>
            <h3 className="text-[15px] font-semibold text-mist">Earning pace</h3>
            <span className="text-[13px] text-mist-faint">At $10M average daily volume</span>
            <div className="mt-4 space-y-3">
              {[
                ['Hourly', hourly, 2],
                ['Daily', data.estDailyUsd / XRP_PRICE, 1],
                ['Monthly', (data.estDailyUsd / XRP_PRICE) * 30, 0],
              ].map(([label, v, d]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-white/[0.05] pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-[14px] text-mist-dim">{label}</span>
                  <span className="text-right">
                    <span className="block text-[15px] font-semibold tabular-nums text-mist">
                      +{num(v, d)} XRP
                    </span>
                    <span className="block text-[12px] tabular-nums text-mist-faint">
                      ≈ {usd(v * XRP_PRICE)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* transactions, bank-statement style */}
      <div className={`rounded-2xl bg-[#141828]/90 backdrop-blur ${cardShadow}`}>
        <div className="flex items-center justify-between px-6 pb-2 pt-5">
          <h3 className="text-[15px] font-semibold text-mist">Recent payouts</h3>
          <span className="text-[13px] font-medium text-azure">Hourly · Automatic</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {data.txs.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-white/[0.02]"
            >
              <span
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-white"
                style={{
                  background:
                    'radial-gradient(120% 120% at 50% 0%, rgba(46,155,255,0.6) 0%, rgba(16,42,92,0.95) 60%, #0A1128 100%)',
                }}
              >
                <XrpMark className="h-[18px] w-[18px]" strokeWidth={5} />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold text-mist">XPY Reward</span>
                <span className="block text-[12.5px] text-mist-faint">Hourly payout · {t.ago}</span>
              </div>
              <div className="text-right">
                <span className="block text-[15px] font-semibold tabular-nums text-[#34D399]">
                  +{num(t.xrp, 2)} XRP
                </span>
                <span className="block text-[12px] tabular-nums text-mist-faint">
                  ≈ {usd(t.xrp * XRP_PRICE, 2)}
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
    <div className="relative overflow-hidden pt-16">
      <div className="pointer-events-none absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-azure-deep/[0.14] blur-[140px]" />

      {/* centered wallet entry */}
      <div className="relative mx-auto max-w-2xl px-6 pb-12 pt-16 text-center sm:pt-24">
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
            Enter your Solana wallet and check your XPY position like a bank
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
