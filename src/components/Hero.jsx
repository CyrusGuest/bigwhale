import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

// XRP-style mark: a downward and an upward chevron forming an X
export function XrpMark({ className = '', strokeWidth = 3.5 }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path
        d="M4 6 L13 14.5 Q16 17.2 19 14.5 L28 6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M4 26 L13 17.5 Q16 14.8 19 17.5 L28 26"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}

const B58 = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz'
const randAddr = () =>
  'r' + Array.from({ length: 6 }, () => B58[Math.floor(Math.random() * B58.length)]).join('')

let dropCounter = 0
function makeDrop() {
  const share = Math.random() * 1.8 + 0.005
  const xrp = share * (Math.random() * 40 + 8)
  return {
    id: ++dropCounter,
    addr: `${randAddr()}…${Math.floor(Math.random() * 9000 + 1000)}`,
    share: `${share.toFixed(3)}%`,
    xrp: `+${xrp.toFixed(2)} XRP`,
  }
}

export default function Hero() {
  const [rows, setRows] = useState(() => Array.from({ length: 6 }, makeDrop))
  const [next, setNext] = useState(2148)

  useEffect(() => {
    const feed = setInterval(() => {
      setRows((prev) => [makeDrop(), ...prev].slice(0, 6))
    }, 2600)
    const clock = setInterval(() => setNext((s) => (s > 0 ? s - 1 : 3600)), 1000)
    return () => {
      clearInterval(feed)
      clearInterval(clock)
    }
  }, [])

  const mm = String(Math.floor(next / 60)).padStart(2, '0')
  const ss = String(next % 60).padStart(2, '0')

  return (
    <section className="relative overflow-hidden pt-16">
      {/* XRP-blue washes */}
      <div className="pointer-events-none absolute -top-56 left-1/3 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-azure-deep/[0.22] blur-[150px]" />
      <div className="pointer-events-none absolute right-[-180px] top-1/4 h-[420px] w-[420px] rounded-full bg-azure/[0.07] blur-[120px]" />

      {/* giant watermark X behind the right column */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [-6, -2, -6] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-40 top-24"
      >
        <XrpMark className="h-[560px] w-[560px] text-azure opacity-[0.05]" strokeWidth={2.2} />
      </motion.div>

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 pb-28 pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-32">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-azure/25 bg-azure/[0.06] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-azure-bright"
          >
            <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-azure" />
            Distributions live · Paid in XRP
          </motion.div>

          <motion.h1
            variants={item}
            className="font-sans text-5xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-[4.4rem]"
          >
            Buy XRPVM.
            <br />
            Get paid in <span className="text-azure">XRP</span>.
          </motion.h1>

          <motion.p variants={item} className="mt-7 max-w-lg text-lg leading-relaxed text-mist-dim">
            The virtual XRP algorithm miner. Every trade in the market pays a
            5% fee — and four fifths of it goes straight to holders as real
            XRP, every hour, automatically. No hardware. No staking. No
            claiming. Your only job is to hold. The more the market trades,
            the more you earn — rewards scale with volume and are never
            guaranteed.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2.5 rounded-full bg-azure px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-azure-bright hover:shadow-[0_0_36px_-8px_rgba(46,155,255,0.6)]"
            >
              <XrpMark className="h-4 w-4" strokeWidth={4} />
              Buy XRPVM
            </a>
            <a href="#how" className="btn-secondary">How Virtual Mining Works</a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex max-w-lg items-center justify-between gap-5 rounded-md border border-azure/20 bg-gradient-to-r from-azure-deep/[0.16] to-transparent px-6 py-5"
          >
            <div className="flex items-start gap-4">
              <span className="mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-azure/40 bg-ink-900 text-azure">
                <XrpMark className="h-5 w-5" strokeWidth={4} />
              </span>
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-azure-bright">
                    XRP Reserve
                  </span>
                  <span className="border border-brass/40 bg-brass/[0.06] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-brass">
                    Attestation pending
                  </span>
                </div>
                <span className="mt-1 block font-serif text-2xl font-medium text-mist">
                  $1,000,000 in XRP
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-mist-faint">
                  A treasury held in a public on-ledger account — audit it any
                  time. Not redemption backing.
                </span>
              </div>
            </div>
            <a
              href="#reserve"
              className="flex-none font-mono text-xs text-azure transition-colors hover:text-azure-bright"
            >
              Verify →
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-white/[0.08] border-t border-white/[0.08] pt-6"
          >
            {[
              ['5%', 'Fee per trade'],
              ['4/5', 'Of fee to holders'],
              ['Hourly', 'Paid in XRP'],
            ].map(([v, l], i) => (
              <div key={l} className={i ? 'pl-6' : ''}>
                <span className="block font-serif text-2xl text-mist">{v}</span>
                <span className="mt-1 block text-[11px] uppercase tracking-[0.12em] text-mist-faint">
                  {l}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* distribution feed panel */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-px rounded-md bg-gradient-to-b from-azure/25 via-transparent to-transparent" />
          <div className="relative overflow-hidden rounded-md border border-white/[0.08] bg-ink-900/95 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
              <span className="flex items-center gap-2.5 text-[13px] font-medium text-mist">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-azure/10 text-azure">
                  <XrpMark className="h-3.5 w-3.5" strokeWidth={4.5} />
                </span>
                XRP Distribution Feed
              </span>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-azure">
                <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-azure" />
                Live
              </span>
            </div>

            <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 border-b border-white/[0.05] bg-ink-800/60 px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-mist-faint">
              <span>Holder</span>
              <span className="text-right">Supply share</span>
              <span className="text-right">Airdropped</span>
            </div>

            <div>
              <AnimatePresence initial={false} mode="popLayout">
                {rows.map((d) => (
                  <motion.div
                    key={d.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-x-6 border-b border-white/[0.04] px-6 py-3.5 font-mono text-xs last:border-0"
                  >
                    <span className="text-mist-dim">{d.addr}</span>
                    <span className="text-right tabular-nums text-mist-faint">{d.share}</span>
                    <span className="text-right tabular-nums font-medium text-azure">{d.xrp}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.07] bg-gradient-to-r from-azure-deep/[0.18] to-transparent px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.15em]">
              <span className="text-mist-dim">
                Next distribution <span className="tabular-nums text-azure-bright">{mm}:{ss}</span>
              </span>
              <span className="text-mist-faint">Pro-rata · All wallets</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
