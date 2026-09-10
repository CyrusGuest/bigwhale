import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TOTAL_SUPPLY = 1_000_000_000
const HOLDER_SHARE = 0.04
const AVG_DAILY_VOLUME = 1_000_000
const XRP_PRICE = 3.02 // display conversion only

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
    vol = Math.max(150_000, Math.min(3_000_000, vol * (0.82 + rng() * 0.4)))
    const usd = vol * HOLDER_SHARE * share
    return { day: i, usd, xrp: usd / XRP_PRICE }
  })

  const totalXrp = days.reduce((s, d) => s + d.xrp, 0)
  const estDailyUsd = AVG_DAILY_VOLUME * HOLDER_SHARE * share
  return { balance, share, days, totalXrp, estDailyUsd }
}

const fmt = (n, d = 2) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: d })

function AreaChart({ points }) {
  const W = 560
  const H = 150
  const P = 8
  const max = Math.max(...points, 1)
  const step = (W - P * 2) / (points.length - 1)
  const y = (v) => H - P - (v / max) * (H - P * 2)
  const line = points.map((v, i) => `${i ? 'L' : 'M'}${P + i * step},${y(v)}`).join(' ')
  const area = `${line} L${P + (points.length - 1) * step},${H - P} L${P},${H - P} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-36 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="portalArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E9BFF" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#2E9BFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#portalArea)" />
      <path d={line} fill="none" stroke="#2E9BFF" strokeWidth="1.5" />
    </svg>
  )
}

function BarChart({ points }) {
  const W = 560
  const H = 120
  const P = 8
  const max = Math.max(...points, 1)
  const bw = (W - P * 2) / points.length
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full" preserveAspectRatio="none">
      {points.map((v, i) => {
        const h = (v / max) * (H - P * 2)
        return (
          <rect
            key={i}
            x={P + i * bw + bw * 0.18}
            y={H - P - h}
            width={bw * 0.64}
            height={h}
            fill="#C3A878"
            opacity="0.75"
          />
        )
      })}
    </svg>
  )
}

function Dashboard({ address, data, sample = false }) {
  const cumulative = data.days.reduce((acc, d) => {
    acc.push((acc[acc.length - 1] || 0) + d.xrp)
    return acc
  }, [])

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs text-mist-dim">
          {address.slice(0, 6)}…{address.slice(-6)}
        </span>
        <span className="border border-brass/40 bg-brass/[0.06] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
          {sample
            ? 'Sample wallet — enter yours above'
            : 'Illustrative preview — live wallet data connects at launch'}
        </span>
      </div>

      {/* summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['XRPVM balance', `${data.balance.toLocaleString('en-US')}`, 'tokens'],
          ['Share of supply', `${(data.share * 100).toFixed(4)}%`, `of ${(TOTAL_SUPPLY / 1e9).toFixed(0)}B supply`],
          ['Est. daily earnings', `${(data.estDailyUsd / XRP_PRICE).toFixed(2)} XRP`, `≈ ${fmt(data.estDailyUsd)} at $1M avg volume`],
          ['Received, last 30 days', `${data.totalXrp.toFixed(1)} XRP`, `≈ ${fmt(data.totalXrp * XRP_PRICE)}`],
        ].map(([label, value, sub]) => (
          <div key={label} className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-6">
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint">
              {label}
            </span>
            <span className="mt-2 block font-serif text-2xl font-medium tabular-nums text-mist">
              {value}
            </span>
            <span className="mt-1 block text-xs text-mist-faint">{sub}</span>
          </div>
        ))}
      </div>

      {/* charts */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="panel rounded-md p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-sm font-medium">Cumulative XRP received</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mist-faint">
              30 days
            </span>
          </div>
          <AreaChart points={cumulative} />
          <div className="mt-2 flex justify-between font-mono text-[10px] text-mist-faint">
            <span>30d ago</span>
            <span>{data.totalXrp.toFixed(1)} XRP today</span>
          </div>
        </div>
        <div className="panel rounded-md p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-sm font-medium">Daily distributions</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mist-faint">
              XRP / day
            </span>
          </div>
          <BarChart points={data.days.map((d) => d.xrp)} />
          <div className="mt-2 flex justify-between font-mono text-[10px] text-mist-faint">
            <span>Varies with daily volume</span>
            <span>avg {(data.totalXrp / data.days.length).toFixed(2)} XRP/day</span>
          </div>
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-xs leading-relaxed text-mist-faint">
        Estimated daily earnings apply the current formula to this
        wallet&rsquo;s share at $1M average volume — they change the moment
        volume does, and are not a promise. Distribution history reflects what
        was actually paid; future distributions may be higher, lower, or zero.
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
      setError('That does not look like a valid Solana address (base58, 32–44 characters).')
      return
    }
    setError('')
    setAddress(trimmed)
  }

  return (
    <div className="relative overflow-hidden pt-16">
      <div className="pointer-events-none absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-azure-deep/[0.14] blur-[140px]" />

      {/* centered wallet entry */}
      <div className="relative mx-auto max-w-2xl px-6 pb-20 pt-24 text-center sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-6">Holder Portal</p>
          <h1 className="font-serif text-5xl font-medium leading-[1.08] tracking-[-0.01em] sm:text-6xl">
            Your wallet, your numbers.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-mist-dim">
            Enter a Solana wallet address to view its XRPVM position —
            holdings, share of supply, distribution history, and estimated
            earnings at average volume.
          </p>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 max-w-xl"
        >
          <div className="flex overflow-hidden rounded-sm border border-white/15 bg-ink-850 shadow-2xl shadow-black/40 focus-within:border-azure/50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Solana wallet address"
              spellCheck="false"
              className="w-full bg-transparent px-5 py-4 text-center font-mono text-sm text-mist placeholder:text-mist-faint focus:outline-none"
            />
            <button
              type="submit"
              className="whitespace-nowrap bg-mist px-7 text-sm font-medium text-ink-950 transition-colors hover:bg-white"
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

      {/* results, or dimmed sample preview */}
      <div className="relative mx-auto max-w-7xl px-6 pb-28">
        <AnimatePresence mode="wait">
          {data ? (
            <motion.div
              key={address}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Dashboard address={address} data={data} />
            </motion.div>
          ) : (
            <motion.div
              key="sample"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="pointer-events-none select-none opacity-45 blur-[1px]">
                <Dashboard address={SAMPLE_ADDRESS} data={sampleData} sample />
              </div>
              <div className="absolute inset-0 flex items-start justify-center bg-gradient-to-b from-transparent via-transparent to-ink-900 pt-24">
                <span className="border border-white/10 bg-ink-900/90 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-mist-dim backdrop-blur">
                  Preview — enter a wallet above to see its data
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
