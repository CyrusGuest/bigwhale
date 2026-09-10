import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XrpMark } from './Hero.jsx'

const XRP_PRICE = 3.02
const DAILY_RATE = 0.004 // $1M avg volume × 4% ÷ $10M mcap

const fmtUsd = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function Drip() {
  const [position, setPosition] = useState(1000)
  const [accrued, setAccrued] = useState(0)
  const [drops, setDrops] = useState([])
  const posRef = useRef(position)
  posRef.current = position

  // continuous per-frame accrual
  useEffect(() => {
    let raf
    let last = performance.now()
    const tick = (now) => {
      const dt = (now - last) / 1000
      last = now
      setAccrued((a) => a + ((posRef.current * DAILY_RATE) / 86400 / XRP_PRICE) * dt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // floating "+hourly drop" chips
  useEffect(() => {
    const iv = setInterval(() => {
      setDrops((d) => [
        ...d.slice(-2),
        { id: Date.now(), amt: (posRef.current * DAILY_RATE) / 24 / XRP_PRICE },
      ])
    }, 3400)
    return () => clearInterval(iv)
  }, [])

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
            This is what holding XRPVM feels like: XRP accruing to your
            position around the clock, paid out every hour, funded by fees on
            every trade in the market. Drag the slider to your position size
            and watch the pace.
          </p>
          <p className="mt-4 font-mono text-[11px] text-mist-faint">
            Simulated at $1M avg daily volume, $10M market cap — arithmetic,
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
              Accruing since you opened this page
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-azure">
              <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-azure" />
              Live sim
            </span>
          </div>

          <div className="relative mt-8">
            <div className="font-mono text-5xl font-medium tabular-nums tracking-tight text-mist sm:text-6xl">
              {accrued.toFixed(7)}
              <span className="ml-3 text-xl text-azure">XRP</span>
            </div>
            {/* rising hourly-drop chips */}
            <div className="pointer-events-none absolute -top-2 right-0">
              <AnimatePresence>
                {drops.map((d) => (
                  <motion.span
                    key={d.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: [0, 1, 1, 0], y: -44 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3 }}
                    className="absolute right-0 whitespace-nowrap rounded-full border border-azure/30 bg-azure/10 px-3 py-1 font-mono text-[11px] text-azure-bright"
                  >
                    +{d.amt.toFixed(4)} XRP / hr
                  </motion.span>
                ))}
              </AnimatePresence>
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
              min="100"
              max="50000"
              step="100"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              className="w-full accent-[#2E9BFF]"
            />
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4">
            <div className="rounded-md border border-white/[0.06] bg-white/[0.03] px-5 py-4">
              <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-mist-faint">
                Every hour
              </span>
              <span className="mt-1 block font-mono text-lg tabular-nums text-azure-bright">
                +{hourly.toFixed(4)} XRP
              </span>
            </div>
            <div className="rounded-md border border-white/[0.06] bg-white/[0.03] px-5 py-4">
              <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-mist-faint">
                Every day
              </span>
              <span className="mt-1 block font-mono text-lg tabular-nums text-mist">
                +{daily.toFixed(3)} XRP
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
