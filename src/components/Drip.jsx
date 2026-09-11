import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { XrpMark } from './Hero.jsx'

const XRP_PRICE = 1.34
const DAILY_RATE = 0.08 // $10M avg volume × 4% ÷ $5M mcap

// logarithmic slider: fine control at small positions, scales up toward $1M
const MIN_POS = 100
const MAX_POS = 1000000
const posFromT = (t) => {
  const raw = MIN_POS * Math.pow(MAX_POS / MIN_POS, t / 1000)
  return raw < 10000 ? Math.round(raw / 100) * 100 : Math.round(raw / 1000) * 1000
}

const fmtUsd = (n) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: n < 10 ? 2 : 0,
  })

export default function Drip() {
  const [t, setT] = useState(600) // ≈ $25,000
  const position = posFromT(t)
  // the counter accrues on the committed position: dragging the slider only
  // updates the pace tiles; when the user lets go, the counter resets to the
  // new position instead of spazzing on every step of the drag
  const [committedPos, setCommittedPos] = useState(() => posFromT(600))
  const [elapsed, setElapsed] = useState(0)
  const tRef = useRef(t)
  tRef.current = t
  const startRef = useRef(null)

  useEffect(() => {
    startRef.current = performance.now()
    let raf
    const tick = (now) => {
      if (startRef.current !== null) setElapsed((now - startRef.current) / 1000)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const commitPosition = () => {
    const next = posFromT(tRef.current)
    setCommittedPos((prev) => {
      if (prev !== next) {
        startRef.current = performance.now()
        setElapsed(0)
      }
      return next
    })
  }

  const perSec = (committedPos * DAILY_RATE) / 86400 / XRP_PRICE
  const accrued = perSec * elapsed
  const mins = Math.floor(elapsed / 60)
  const secs = Math.floor(elapsed % 60)

  const hourly = (position * DAILY_RATE) / 24 / XRP_PRICE
  const daily = (position * DAILY_RATE) / XRP_PRICE

  return (
    <section id="drip" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow mb-6">Passive by Design</p>
          <h2 className="text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
            Your wallet earns
            <br />
            <span className="text-azure">while you do nothing.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-mist-dim">
            This is what holding XPY feels like: XRP passively earned
            around the clock and sent to your wallet every hour by the
            algorithm, even while you sleep. Drag the slider to your position
            size and watch how fast it adds up.
          </p>
          <p className="mt-4 font-mono text-[11px] text-mist-faint">
            Simulated at $10M avg daily volume, $5M market cap, arithmetic,
            not a promise. Real pace rises and falls with volume.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="panel relative overflow-hidden rounded-lg p-8 sm:p-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-azure/[0.08] blur-[80px]" />

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-[13px] font-medium text-mist">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-azure/10 text-azure">
                <XrpMark className="h-3.5 w-3.5" strokeWidth={4.5} />
              </span>
              Passive earnings
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-azure">
              <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-azure" />
              Live sim
            </span>
          </div>

          <div className="relative mt-7">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint">
              XRP earned since you opened this page · {mins > 0 ? `${mins}m ` : ''}{secs}s
            </span>
            <div className="mt-2 font-mono text-4xl font-medium tabular-nums tracking-tight text-mist sm:text-6xl">
              {accrued.toFixed(4)}
              <span className="ml-3 text-xl text-azure">XRP</span>
            </div>
            <div className="mt-1.5 font-mono text-base tabular-nums text-mist-faint">
              ≈ ${(accrued * XRP_PRICE).toFixed(2)} USD
            </div>
          </div>

          <div className="mt-9">
            <div className="mb-3 flex items-baseline justify-between">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist-faint">
                Your position
              </label>
              <span className="font-mono text-sm tabular-nums text-mist">{fmtUsd(position)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="1"
              value={t}
              onChange={(e) => setT(Number(e.target.value))}
              onPointerUp={commitPosition}
              onKeyUp={commitPosition}
              onBlur={commitPosition}
              className="w-full accent-[#2E9BFF]"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-mist-faint">
              <span>$100</span>
              <span>$1M</span>
            </div>
          </div>

          <div className="mt-7 divide-y divide-white/[0.05] rounded-lg border border-white/[0.06] bg-white/[0.03]">
            {[
              ['Every hour', hourly, true],
              ['Every day', daily, false],
              ['Every month', daily * 30, false],
            ].map(([label, v, hot]) => (
              <div key={label} className="flex items-baseline justify-between px-5 py-3.5">
                <span className="text-sm text-mist-dim">{label}</span>
                <span className="flex items-baseline gap-2.5">
                  <span
                    className={`font-mono text-sm font-medium tabular-nums sm:text-base ${
                      hot ? 'text-azure-bright' : 'text-mist'
                    }`}
                  >
                    +{v.toLocaleString('en-US', {
                      maximumFractionDigits: v >= 100 ? 0 : v >= 10 ? 1 : 2,
                    })}{' '}
                    XRP
                  </span>
                  <span className="font-mono text-xs tabular-nums text-mist-faint">
                    ≈ {fmtUsd(v * XRP_PRICE)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
