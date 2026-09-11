import { useState } from 'react'
import { motion } from 'framer-motion'

const HOLDER_SHARE = 0.04 // 4% of trade volume flows to holders
const HORIZONS = [30, 90, 180, 365]

const fmt = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
const fmtShort = (n) =>
  n >= 1e6
    ? `$${(n / 1e6).toFixed(2)}M`
    : n >= 10000
      ? `$${(n / 1e3).toFixed(1)}k`
      : fmt(n)

function GrowthChart({ position, dailyRate, days, total }) {
  const W = 600
  const H = 200
  const L = 12
  const R = 86
  const T = 18
  const B = 26
  const N = 60
  const pts = Array.from({ length: N + 1 }, (_, i) => position * dailyRate * ((days / N) * i))
  const max = Math.max(total, 1)
  const x = (i) => L + ((W - L - R) / N) * i
  const y = (v) => H - B - (v / max) * (H - T - B)
  const line = pts.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const area = `${line} L${x(N)},${H - B} L${x(0)},${H - B} Z`

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
        <defs>
          <linearGradient id="calcArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2E9BFF" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2E9BFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={L}
            x2={W - R}
            y1={y(max * g)}
            y2={y(max * g)}
            stroke="#ffffff"
            strokeOpacity="0.05"
          />
        ))}

        <path d={area} fill="url(#calcArea)" />
        <path d={line} fill="none" stroke="#2E9BFF" strokeWidth="2.5" />

        <circle cx={x(N)} cy={y(total)} r="4" fill="#2E9BFF" />
        <circle cx={x(N)} cy={y(total)} r="8" fill="#2E9BFF" fillOpacity="0.25">
          <animate attributeName="r" values="6;11;6" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <text
          x={x(N) + 10}
          y={y(total) + 4}
          fill="#66B8FF"
          fontSize="12"
          fontFamily="IBM Plex Mono, monospace"
        >
          {fmtShort(total)}
        </text>

        <text x={L} y={H - 6} fill="#606D89" fontSize="10" fontFamily="IBM Plex Mono, monospace">
          day 0
        </text>
        <text
          x={x(N)}
          y={H - 6}
          fill="#606D89"
          fontSize="10"
          textAnchor="end"
          fontFamily="IBM Plex Mono, monospace"
        >
          day {days}
        </text>
      </svg>
      <div className="mt-1 font-mono text-[10px] text-mist-faint">
        Total XRP earned over time, in dollars, at your inputs
      </div>
    </div>
  )
}

export default function Calculator() {
  const [position, setPosition] = useState(1000)
  const [mcap, setMcap] = useState(5000000)
  const [volume, setVolume] = useState(10000000)
  const [days, setDays] = useState(30)

  const dailyRate = mcap > 0 ? (volume * HOLDER_SHARE) / mcap : 0
  const sharePct = mcap > 0 ? (position / mcap) * 100 : 0

  const daily = position * dailyRate
  const total = daily * days
  const pctTotal = position > 0 ? (total / position) * 100 : 0

  const sliders = [
    {
      label: 'Position',
      value: position,
      set: setPosition,
      min: 100,
      max: 100000,
      step: 100,
      display: fmt(position),
      note: null,
    },
    {
      label: 'Market cap',
      value: mcap,
      set: setMcap,
      min: 500000,
      max: 50000000,
      step: 100000,
      display: fmtShort(mcap),
      note: null,
    },
    {
      label: '24h volume',
      value: volume,
      set: setVolume,
      min: 0,
      max: 20000000,
      step: 50000,
      display: fmtShort(volume),
      note: 'Default = recent average. Historical, not a promise.',
    },
  ]

  return (
    <section id="calculator" className="mx-auto max-w-7xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="mb-12 max-w-2xl"
      >
        <p className="eyebrow mb-5">Estimator</p>
        <h2 className="font-serif text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
          What could your position earn?
        </h2>
        <p className="mt-5 leading-relaxed text-mist-dim">
          One formula, nothing hidden: daily volume × 4% × your share of
          market cap. Set your assumptions, pick a horizon, and see the pace
          for yourself.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="panel grid overflow-hidden rounded-md lg:grid-cols-[0.9fr_1.1fr]"
      >
        {/* inputs */}
        <div className="space-y-8 p-8 sm:p-10">
          {sliders.map((s) => (
            <div key={s.label}>
              <div className="mb-3 flex items-baseline justify-between">
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist-faint">
                  {s.label}
                </label>
                <span className="font-mono text-sm tabular-nums text-mist">{s.display}</span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={s.value}
                onChange={(e) => s.set(Number(e.target.value))}
                className="w-full accent-[#2E9BFF]"
              />
              {s.note && <p className="mt-2 text-[11px] text-mist-faint">{s.note}</p>}
            </div>
          ))}

          <div>
            <label className="mb-3 block font-mono text-[11px] uppercase tracking-[0.2em] text-mist-faint">
              Horizon
            </label>
            <div className="grid grid-cols-4 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10">
              {HORIZONS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setDays(h)}
                  className={`px-3 py-2.5 font-mono text-xs transition-colors ${
                    days === h ? 'bg-mist text-ink-950' : 'bg-ink-850 text-mist-dim hover:text-mist'
                  }`}
                >
                  {h}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* results */}
        <div className="flex flex-col border-t border-white/[0.07] bg-ink-800/50 p-8 sm:p-10 lg:border-l lg:border-t-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist-faint">
            Estimated at these inputs
          </span>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-serif text-4xl font-medium tabular-nums text-mist sm:text-5xl">
              {fmt(total)}
            </span>
            <span className="text-sm text-mist-faint">
              / {days} days · {pctTotal.toFixed(1)}%
            </span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-white/[0.08] bg-white/[0.08] font-mono text-xs">
            <div className="bg-ink-850 px-4 py-3">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-mist-faint">
                Per day
              </span>
              <span className="mt-1 block tabular-nums text-mist">{fmt(daily)}</span>
            </div>
            <div className="bg-ink-850 px-4 py-3">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-mist-faint">
                Per month
              </span>
              <span className="mt-1 block tabular-nums text-mist">{fmt(daily * 30)}</span>
            </div>
            <div className="bg-ink-850 px-4 py-3">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-mist-faint">
                Supply share
              </span>
              <span className="mt-1 block tabular-nums text-mist">{sharePct.toFixed(4)}%</span>
            </div>
          </div>

          <div className="mt-7 flex-1">
            <GrowthChart position={position} dailyRate={dailyRate} days={days} total={total} />
          </div>

          <div className="mt-6 flex flex-col gap-1.5 border-t border-white/[0.08] pt-4 font-mono text-[11px] leading-relaxed text-mist-faint">
            <span>
              {fmtShort(volume)} × 4% ÷ {fmtShort(mcap)} ={' '}
              <span className="text-mist-dim">{(dailyRate * 100).toFixed(3)}%/day</span>
            </span>
            <span>
              Arithmetic at your inputs, not a projection. Volume is
              unknowable, and at zero volume payouts are zero.
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
