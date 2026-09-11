import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { XrpMark } from './Hero.jsx'

const EASE = [0.22, 1, 0.36, 1]
const XRP_PRICE = 1.34
const RESERVE_USD = 1000000
const RESERVE_XRP = Math.round(RESERVE_USD / XRP_PRICE)

function Float({ children, delay = 0, amt = 7, dur = 5, className = '' }) {
  return (
    <motion.div
      animate={{ y: [0, -amt, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function CountUp({ target, prefix = '', suffix = '', duration = 2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / (duration * 1000), 1)
      setValue(target * (1 - Math.pow(1 - t, 4)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, duration])
  return (
    <span ref={ref}>
      {prefix}
      {Math.round(value).toLocaleString('en-US')}
      {suffix}
    </span>
  )
}

// app-quality flow: glassy stage cards, animated connectors, traveling pulses
function StageCard({ icon, title, sub, hot = false, dot = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, type: 'spring', stiffness: 240, damping: 24 }}
      className={`relative flex items-center gap-3.5 rounded-2xl p-4 backdrop-blur-xl ${
        hot
          ? 'bg-azure-deep/[0.35] shadow-[0_12px_30px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12),0_0_40px_-12px_rgba(46,155,255,0.5)]'
          : 'bg-[#1c2030]/80 shadow-[0_10px_26px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]'
      }`}
    >
      {hot && (
        <motion.span
          animate={{ opacity: [0.35, 0.8, 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -inset-px rounded-2xl shadow-[0_0_36px_-8px_rgba(46,155,255,0.65)]"
        />
      )}
      <span
        className={`relative flex h-10 w-10 flex-none items-center justify-center rounded-[11px] ${
          hot ? 'bg-azure text-white shadow-md shadow-azure/40' : 'bg-white/[0.07] text-azure-bright'
        }`}
      >
        {icon}
      </span>
      <span className="relative min-w-0">
        <span className="flex items-center gap-1.5 text-[14px] font-semibold leading-tight text-white">
          {dot && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-azure"
            />
          )}
          {title}
        </span>
        <span className="mt-0.5 block text-[12px] leading-snug text-white/60">{sub}</span>
      </span>
    </motion.div>
  )
}

function Connector({ split = false }) {
  return (
    <div className="relative mx-auto flex items-center justify-center lg:mx-0">
      {/* vertical (mobile) */}
      <div className="relative h-8 w-px overflow-hidden bg-gradient-to-b from-azure/10 via-azure/35 to-azure/10 lg:hidden">
        <motion.span
          animate={{ top: ['-15%', '110%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeIn' }}
          className="absolute left-1/2 h-2.5 w-[3px] -translate-x-1/2 rounded-full bg-azure shadow-[0_0_8px_2px_rgba(46,155,255,0.7)]"
        />
      </div>
      {/* horizontal (desktop) */}
      <div className={`relative hidden h-px w-10 overflow-hidden bg-gradient-to-r from-azure/10 via-azure/35 to-azure/10 lg:block ${split ? 'lg:w-8' : ''}`}>
        <motion.span
          animate={{ left: ['-15%', '110%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeIn' }}
          className="absolute top-1/2 h-[3px] w-2.5 -translate-y-1/2 rounded-full bg-azure shadow-[0_0_8px_2px_rgba(46,155,255,0.7)]"
        />
      </div>
    </div>
  )
}

function FlowDiagram() {
  return (
    <div>
      <div className="flex flex-col lg:grid lg:grid-cols-[1.1fr_auto_1fr_auto_1.2fr] lg:items-center lg:gap-0">
        <StageCard
          delay={0}
          icon={
            <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
              <path d="M4 6.5h9.2l-2.1-2.1 1.4-1.4 4.5 4.5-4.5 4.5-1.4-1.4 2.1-2.1H4v-2Zm12 7h-9.2l2.1 2.1-1.4 1.4-4.5-4.5 4.5-4.5 1.4 1.4-2.1 2.1H16v2Z" />
            </svg>
          }
          title="Every trade"
          sub="Buys and sells alike pay the fee"
        />
        <Connector />
        <StageCard
          delay={0.12}
          hot
          icon={<span className="text-[17px] font-bold">5%</span>}
          title="Fee collected"
          sub="On-chain, converted to XRP"
        />
        <Connector split />
        <div className="flex flex-col gap-3 lg:gap-3">
          <StageCard
            delay={0.24}
            dot
            icon={<XrpMark className="h-5 w-5" strokeWidth={4.5} />}
            title="Holders · 4/5"
            sub="Hourly XRP, straight to wallets"
          />
          <StageCard
            delay={0.34}
            icon={
              <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
                <path d="M17 3.5v13l-5-2.6H7.5A2.5 2.5 0 0 1 5 11.4v-.06L4.6 15H2.8l.5-4A2.5 2.5 0 0 1 2 8.9c0-1.38 1.12-2.5 2.5-2.5H12l5-2.9Z" />
              </svg>
            }
            title="Marketing & referrals · 1/5"
            sub="Growth budget and referral bonuses"
          />
        </div>
      </div>

      {/* reserve foundation bar */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: 0.45, type: 'spring', stiffness: 220, damping: 24 }}
        className="relative mt-5 flex items-center gap-3.5 overflow-hidden rounded-2xl bg-gradient-to-r from-azure-deep/[0.3] to-[#1c2030]/80 p-4 backdrop-blur-xl shadow-[0_10px_26px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)]"
      >
        <motion.span
          animate={{ opacity: [0.3, 0.75, 0.3] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -inset-px rounded-2xl shadow-[0_0_40px_-10px_rgba(46,155,255,0.5)]"
        />
        <span className="relative flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-azure/15 text-azure">
          <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
            <path d="M10 1.5a4.2 4.2 0 0 1 4.2 4.2V8h.8A1.5 1.5 0 0 1 16.5 9.5v7A1.5 1.5 0 0 1 15 18H5a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 5 8h.8V5.7A4.2 4.2 0 0 1 10 1.5Zm0 2a2.2 2.2 0 0 0-2.2 2.2V8h4.4V5.7A2.2 2.2 0 0 0 10 3.5Z" />
          </svg>
        </span>
        <span className="relative min-w-0">
          <span className="block text-[14px] font-semibold text-white">$1,000,000 XRP Reserve</span>
          <span className="mt-0.5 block text-[12px] leading-snug text-white/60">
            Standing treasury · publicly auditable · separate from the fee flow above
          </span>
        </span>
      </motion.div>
    </div>
  )
}

const principles = [
  {
    title: 'Held on the public ledger',
    body: 'The reserve lives in a dedicated, published wallet address. Its balance is checkable by anyone, at any time, without asking us.',
  },
  {
    title: 'Never lent, never mixed',
    body: 'Reserve XRP is not lent out, staked, or commingled with the rewards pool or team funds. It sits, visibly, as the project’s standing treasury.',
  },
  {
    title: 'Not the source of yield',
    body: 'Payouts are funded by trading fees — never by drawing down the reserve, and never by new buyers’ principal. The reserve is credibility, not the faucet.',
  },
]

export default function Reserve() {
  return (
    <section id="reserve" className="relative overflow-x-clip border-y border-white/[0.06]">
      <div className="pointer-events-none absolute -left-64 top-0 h-[480px] w-[720px] rounded-full bg-azure-deep/[0.18] blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[380px] w-[520px] rounded-full bg-azure/[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
        {/* headline: lines slam in from opposite sides */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: [0, 1.15, 1] }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow mb-7"
          >
            First Mover
          </motion.p>
          <Float amt={6} dur={5.5}>
            <motion.h2
              initial={{ opacity: 0, x: -240 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, ease: EASE }}
              className="text-4xl font-bold tracking-[-0.03em] sm:text-6xl"
            >
              The future coin of the
            </motion.h2>
          </Float>
          <Float delay={0.4} amt={7} dur={5}>
            <motion.h2
              initial={{ opacity: 0, x: 240 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.15, duration: 0.55, ease: EASE }}
              className="text-4xl font-bold tracking-[-0.03em] sm:text-6xl"
            >
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-azure to-azure-bright bg-clip-text text-transparent">
                  XRP ecosystem.
                </span>
                <span aria-hidden className="text-glint absolute inset-0">
                  XRP ecosystem.
                </span>
              </span>
            </motion.h2>
          </Float>

          {/* the number: rolls up with heartbeat and sonar rings */}
          <Float delay={0.6} amt={8} dur={4.8}>
            <div className="relative mt-10">
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0], scale: [0.85, 1.5] }}
                  transition={{ delay: 2.4 + i * 1.5, duration: 3, repeat: Infinity, ease: 'easeOut' }}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-[min(80vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-azure/40"
                />
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 1.3, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: 0.35, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl font-bold tabular-nums tracking-[-0.03em] text-mist [text-shadow:0_0_60px_rgba(46,155,255,0.4)] sm:text-8xl"
              >
                <motion.span
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ delay: 2.4, duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block"
                >
                  <CountUp target={RESERVE_USD} prefix="$" />
                </motion.span>
              </motion.div>
            </div>
          </Float>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.6, duration: 0.5, ease: EASE }}
            className="mt-4 text-xl font-medium text-mist sm:text-2xl"
          >
            starting reserve of <span className="text-shimmer">XRP</span>
          </motion.p>

          {/* verification pill row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.8, duration: 0.5, ease: EASE }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
          >
            <span className="flex items-center gap-2 rounded-full border border-azure/30 bg-azure/[0.08] px-4 py-2 text-sm font-medium tabular-nums text-azure-bright">
              <XrpMark className="h-3.5 w-3.5" strokeWidth={5} />
              ≈ <CountUp target={RESERVE_XRP} suffix=" XRP" /> held
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-mist-dim">
              Public on-ledger address
            </span>
            <span className="rounded-full border border-brass/40 bg-brass/[0.06] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-brass">
              Attestation pending
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.95, duration: 0.55, ease: EASE }}
            className="mx-auto mt-7 max-w-2xl leading-relaxed text-mist-dim"
          >
            Nobody else pairs a seven-figure XRP treasury, sitting on the
            public ledger for anyone to audit, with an algorithm that pays
            holders every hour. XPY does. The fees pay you. The reserve stands
            behind the project: our thank-you to the XRP ecosystem we are
            building in, and our proof of long-term commitment.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-3 font-mono text-[11px] text-mist-faint"
          >
            First of its kind as far as we can find. If another project has
            done this, show us.
          </motion.p>
        </div>

        {/* flow diagram springs up */}
        <Float delay={1} amt={5} dur={5.6}>
          <motion.div
            initial={{ opacity: 0, y: 90, scale: 0.94, rotate: -1.2 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ type: 'spring', stiffness: 170, damping: 21 }}
            className="mx-auto mt-14 max-w-3xl rounded-lg border border-white/[0.08] bg-ink-900/85 p-6 shadow-2xl shadow-black/50 backdrop-blur sm:p-8"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] font-medium text-mist">Where value flows</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint">
                Live mechanism
              </span>
            </div>
            <FlowDiagram />
          </motion.div>
        </Float>

        {/* principles fly in from alternating edges */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {principles.map((p, i) => (
            <Float key={p.title} delay={0.5 + i * 0.5} amt={5} dur={4.8 + i * 0.5}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 ? 260 : -260, rotate: i % 2 ? 4 : -4 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.12, type: 'spring', stiffness: 190, damping: 21 }}
                className="h-full rounded-lg border border-white/[0.06] bg-white/[0.03] p-7 transition-colors hover:border-azure/25"
              >
                <span className="font-mono text-[11px] text-azure">0{i + 1}</span>
                <h3 className="mb-2.5 mt-4 font-medium tracking-tight">{p.title}</h3>
                <p className="text-sm leading-relaxed text-mist-dim">{p.body}</p>
              </motion.div>
            </Float>
          ))}
        </div>
      </div>
    </section>
  )
}
