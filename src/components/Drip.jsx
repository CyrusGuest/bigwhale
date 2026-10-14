import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { OilMark } from './Hero.jsx'
import { REVEAL } from '../motionPrefs.js'
import AirdropCountdown from './AirdropCountdown.jsx'
import { UsoLink } from './Uso.jsx'

const XRP_PRICE = 1.34
const MCAP = 5000000 // simulated market cap
const FEE = 0.04 // 4% of volume flows to holders
// daily yield on a position = volume × 4% ÷ market cap
const dailyRate = (volume) => (volume * FEE) / MCAP

// logarithmic slider: fine control at small positions, scales up toward $1M
const MIN_POS = 100
const MAX_POS = 1000000
const posFromT = (t) => {
  const raw = MIN_POS * Math.pow(MAX_POS / MIN_POS, t / 1000)
  return raw < 10000 ? Math.round(raw / 100) * 100 : Math.round(raw / 1000) * 1000
}

// volume slider: $100k to $10M a day, opening at $1M
const MIN_VOL = 100000
const MAX_VOL = 10000000
const VOL_STEP = 50000
const DEFAULT_VOL = 1000000

const fmtUsd = (n) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: n < 10 ? 2 : 0,
  })
const fmtShort = (n) => (n >= 1e6 ? `$${(n / 1e6).toFixed(n % 1e6 ? 1 : 0)}M` : `$${Math.round(n / 1e3)}k`)

export default function Drip() {
  const [t, setT] = useState(600) // ≈ $25,000
  const [volume, setVolume] = useState(DEFAULT_VOL)
  const position = posFromT(t)
  // the counter accrues on the committed inputs: dragging a slider only
  // updates the pace tiles; when the user lets go, the counter resets to the
  // new inputs instead of spazzing on every step of the drag
  const [committed, setCommitted] = useState(() => ({ pos: posFromT(600), vol: DEFAULT_VOL }))
  const [elapsed, setElapsed] = useState(0)
  const tRef = useRef(t)
  tRef.current = t
  const volRef = useRef(volume)
  volRef.current = volume
  const startRef = useRef(null)

  // the counter only needs to move a few times a second, and only while it
  // can be seen: a per-frame setState here re-rendered this whole section 60
  // times a second from page open, through the hero intro, while off screen
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { amount: 0.1 })
  useEffect(() => {
    if (startRef.current === null) startRef.current = performance.now()
    if (!inView) return
    const tick = () => setElapsed((performance.now() - startRef.current) / 1000)
    tick()
    const iv = setInterval(tick, 250)
    return () => clearInterval(iv)
  }, [inView])

  const commitInputs = () => {
    const next = { pos: posFromT(tRef.current), vol: volRef.current }
    setCommitted((prev) => {
      if (prev.pos === next.pos && prev.vol === next.vol) return prev
      startRef.current = performance.now()
      setElapsed(0)
      return next
    })
  }

  const perSec = (committed.pos * dailyRate(committed.vol)) / 86400 / XRP_PRICE
  const accrued = perSec * elapsed
  const mins = Math.floor(elapsed / 60)
  const secs = Math.floor(elapsed % 60)

  const rate = dailyRate(volume)
  const hourly = (position * rate) / 24 / XRP_PRICE
  const daily = (position * rate) / XRP_PRICE

  return (
    <section id="drip" ref={sectionRef} className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={REVEAL ? { opacity: 0, y: 20, filter: 'blur(8px)' } : false}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-6">Passive by Design</p>
          <h2 className="font-serif text-4xl font-semibold tracking-[-0.01em] sm:text-5xl">
            Your wallet earns
            <br />
            <span className="text-gold">while you do nothing.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-mist-dim">
            This is what holding XTO feels like: <UsoLink /> passively earned
            around the clock and sent to your wallet every hour by the
            algorithm, even while you sleep. Drag the sliders to your position
            size and a daily volume and watch how fast it adds up.
          </p>
          <p className="mt-4 font-mono text-[11px] text-mist-faint">
            Simulated at a $5M market cap and the volume you set, arithmetic,
            not a promise. Real pace rises and falls with volume.
          </p>
        </motion.div>

        <motion.div
          initial={REVEAL ? { opacity: 0, y: 28, filter: 'blur(8px)' } : false}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="panel relative overflow-hidden rounded-lg p-8 sm:p-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/[0.08] blur-[80px]" />

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-[13px] font-medium text-mist">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/10 text-gold">
                <OilMark className="h-3.5 w-3.5" strokeWidth={4.5} />
              </span>
              Passive earnings
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
              <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-gold" />
              Live sim
            </span>
          </div>
          <div className="mt-4">
            <AirdropCountdown />
          </div>

          <div className="relative mt-7">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="text-sm font-medium text-mist sm:text-[15px]">
                <UsoLink /> earned since you opened this page
              </span>
              <span className="rounded-full border border-gold/30 bg-gold/[0.08] px-2.5 py-0.5 font-mono text-[11px] tabular-nums text-gold-deep">
                {mins > 0 ? `${mins}m ` : ''}
                {secs}s
              </span>
            </div>
            <div className="mt-2 text-4xl font-semibold tabular-nums tracking-tight text-mist sm:text-6xl">
              ${(accrued * XRP_PRICE).toFixed(4)}
              <span className="ml-3 text-xl font-medium text-gold">of <UsoLink /></span>
            </div>
          </div>

          <div className="mt-9">
            <div className="mb-3 flex items-baseline justify-between">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist-faint">
                Your position
              </label>
              <span className="text-sm font-semibold tabular-nums text-mist">{fmtUsd(position)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="1"
              value={t}
              onChange={(e) => setT(Number(e.target.value))}
              onPointerUp={commitInputs}
              onKeyUp={commitInputs}
              onBlur={commitInputs}
              className="w-full accent-[#32E7D0]"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-mist-faint">
              <span>$100</span>
              <span>$1M</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-baseline justify-between">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist-faint">
                Daily volume
              </label>
              <span className="text-sm font-semibold tabular-nums text-mist">{fmtShort(volume)}</span>
            </div>
            <input
              type="range"
              min={MIN_VOL}
              max={MAX_VOL}
              step={VOL_STEP}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              onPointerUp={commitInputs}
              onKeyUp={commitInputs}
              onBlur={commitInputs}
              className="w-full accent-[#32E7D0]"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-mist-faint">
              <span>$100k</span>
              <span>{(rate * 100).toFixed(2)}% / day</span>
              <span>$10M</span>
            </div>
          </div>

          <div className="mt-7 divide-y divide-navy/[0.05] rounded-lg border border-navy/[0.06] bg-navy/[0.03]">
            {[
              ['Every hour', hourly, true],
              ['Every day', daily, false],
              ['Every month', daily * 30, false],
            ].map(([label, v, hot]) => (
              <div key={label} className="flex items-center justify-between px-5 py-4">
                <span className="text-[15px] font-medium text-mist">{label}</span>
                <span className="flex flex-wrap items-baseline justify-end gap-x-2.5 text-right">
                  <span
                    className={`text-base font-semibold tabular-nums sm:text-lg ${
                      hot ? 'text-gold-deep' : 'text-mist'
                    }`}
                  >
                    +{fmtUsd(v * XRP_PRICE)}
                  </span>
                  <span className="text-sm text-mist-dim">of <UsoLink /></span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
