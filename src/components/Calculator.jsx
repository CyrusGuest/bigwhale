import { useState } from 'react'
import { motion } from 'framer-motion'

const HOLDER_SHARE = 0.04 // 4% of trade volume flows to holders
const TRADE_FEE = 0.05 // fee paid when swapping rewards back into the token
const HORIZONS = [30, 90, 180, 365]

const fmt = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
const fmtShort = (n) =>
  n >= 1e6
    ? `$${(n / 1e6).toFixed(2)}M`
    : n >= 10000
      ? `$${(n / 1e3).toFixed(1)}k`
      : fmt(n)

function GrowthChart({ position, dailyRate, compHourly, days, simpleTotal, compTotal, diff }) {
  const W = 600
  const H = 220
  const L = 12
  const R = 86
  const T = 18
  const B = 26
  const N = 72
  const pts = Array.from({ length: N + 1 }, (_, i) => {
    const d = (days / N) * i
    return {
      simple: position * dailyRate * d,
      comp: position * (Math.pow(compHourly, 24 * d) - 1),
    }
  })
  const max = Math.max(compTotal, simpleTotal, 1)
  const x = (i) => L + ((W - L - R) / N) * i
  const y = (v) => H - B - (v / max) * (H - T - B)

  const line = (key) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p[key])}`).join(' ')
  const band =
    line('comp') +
    pts
      .slice()
      .reverse()
      .map((p, i) => `L${x(N - i)},${y(p.simple)}`)
      .join('') +
    ' Z'
  const area = `${line('comp')} L${x(N)},${H - B} L${x(0)},${H - B} Z`

  const showDiff = diff > position * 0.002

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
        <defs>
          <linearGradient id="calcArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2E9BFF" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#2E9BFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="calcBand" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2E9BFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#2E9BFF" stopOpacity="0.34" />
          </linearGradient>
        </defs>

        {/* gridlines */}
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

        {/* fills */}
        <path d={area} fill="url(#calcArea)" />
        <path d={band} fill="url(#calcBand)" />

        {/* curves */}
        <path
          d={line('simple')}
          fill="none"
          stroke="#606D89"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <path d={line('comp')} fill="none" stroke="#2E9BFF" strokeWidth="2.5" />

        {/* endpoints + labels */}
        <circle cx={x(N)} cy={y(compTotal)} r="3.5" fill="#2E9BFF" />
        <circle cx={x(N)} cy={y(simpleTotal)} r="3" fill="#606D89" />
        <text
          x={x(N) + 10}
          y={y(compTotal) + 4}
          fill="#66B8FF"
          fontSize="12"
          fontFamily="IBM Plex Mono, monospace"
        >
          {fmtShort(compTotal)}
        </text>
        <text
          x={x(N) + 10}
          y={Math.max(y(simpleTotal) + 4, y(compTotal) + 20)}
          fill="#606D89"
          fontSize="11"
          fontFamily="IBM Plex Mono, monospace"
        >
          {fmtShort(simpleTotal)}
        </text>
        {showDiff && (
          <text
            x={x(Math.floor(N * 0.66))}
            y={y((compTotal + simpleTotal * 2) / 3) - 10}
            fill="#2E9BFF"
            fontSize="11"
            fontFamily="IBM Plex Mono, monospace"
          >
            +{fmtShort(diff)} from compounding
          </text>
        )}

        {/* axis labels */}
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
      <div className="mt-1 flex items-center gap-5 font-mono text-[10px] text-mist-faint">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-[2px] w-4 rounded bg-azure" /> compounded
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-px w-4 border-t border-dashed border-mist-faint" /> not
          compounded
        </span>
      </div>
    </div>
  )
}

export default function Calculator() {
  const [position, setPosition] = useState(1000)
  const [mcap, setMcap] = useState(5000000)
  const [volume, setVolume] = useState(10000000)
  const [compound, setCompound] = useState(false)
  const [days, setDays] = useState(30)

  const hourlyRate = mcap > 0 ? (volume * HOLDER_SHARE) / 24 / mcap : 0
  const dailyRate = hourlyRate * 24
  const sharePct = mcap > 0 ? (position / mcap) * 100 : 0

  const simpleDaily = position * dailyRate
  const simpleTotal = simpleDaily * days
  const compHourly = 1 + hourlyRate * (1 - TRADE_FEE)
  const compTotal = position * (Math.pow(compHourly, 24 * days) - 1)
  const compFirstDay = position * (Math.pow(compHourly, 24) - 1)
  const compLastDay =
    position * Math.pow(compHourly, 24 * (days - 1)) * (Math.pow(compHourly, 24) - 1)

  const total = compound ? compTotal : simpleTotal
  const pctTotal = position > 0 ? (total / position) * 100 : 0
  const diff = compTotal - simpleTotal

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
          market cap. Set your assumptions, pick a horizon, flip on
          compounding, and see the pace for yourself.
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

          <label className="flex cursor-pointer items-center gap-4 border-t border-white/[0.08] pt-6">
            <input
              type="checkbox"
              checked={compound}
              onChange={(e) => setCompound(e.target.checked)}
              className="h-4 w-4 accent-[#C3A878]"
            />
            <span>
              <span className="block text-sm font-medium text-mist">Compound hourly</span>
              <span className="mt-0.5 block text-[11px] text-mist-faint">
                Swap each XRP payout back into XPY · includes the 5% re-buy fee
              </span>
            </span>
          </label>
        </div>

        {/* results */}
        <div className="flex flex-col border-t border-white/[0.07] bg-ink-800/50 p-8 sm:p-10 lg:border-l lg:border-t-0">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-5xl font-medium tabular-nums text-mist">
                {fmt(total)}
              </span>
              <span className="text-sm text-mist-faint">
                / {days} days · {pctTotal.toFixed(1)}%
              </span>
            </div>
            {compound && (
              <span className="border border-brass/40 bg-brass/[0.06] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
                Compounding
              </span>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-white/[0.08] bg-white/[0.08] font-mono text-xs">
            <div className="bg-ink-850 px-4 py-3">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-mist-faint">
                {compound ? 'Day 1' : 'Per day'}
              </span>
              <span className="mt-1 block tabular-nums text-mist">
                {fmt(compound ? compFirstDay : simpleDaily)}
              </span>
            </div>
            <div className="bg-ink-850 px-4 py-3">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-mist-faint">
                {compound ? `Day ${days}` : 'Supply share'}
              </span>
              <span className="mt-1 block tabular-nums text-mist">
                {compound ? fmt(compLastDay) : `${sharePct.toFixed(4)}%`}
              </span>
            </div>
            <div className="bg-ink-850 px-4 py-3">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-mist-faint">
                Compounding {compound ? 'adds' : 'would add'}
              </span>
              <span className={`mt-1 block tabular-nums ${diff > 0 ? 'text-azure' : 'text-mist'}`}>
                +{fmt(diff)}
              </span>
            </div>
          </div>

          <div className="mt-7 flex-1">
            <GrowthChart
              position={position}
              dailyRate={dailyRate}
              compHourly={compHourly}
              days={days}
              simpleTotal={simpleTotal}
              compTotal={compTotal}
              diff={diff}
            />
          </div>

          <div className="mt-6 flex flex-col gap-1.5 border-t border-white/[0.08] pt-4 font-mono text-[11px] leading-relaxed text-mist-faint">
            <span>
              {fmtShort(volume)} × 4% ÷ {fmtShort(mcap)} ={' '}
              <span className="text-mist-dim">{(dailyRate * 100).toFixed(3)}%/day</span>
              {compound && ` · hourly ×(1 + ${(hourlyRate * 100).toFixed(4)}% × 95%)`}
            </span>
            <span>
              Arithmetic at your inputs, not a projection, volume is
              unknowable, and at zero volume distributions are zero.
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
