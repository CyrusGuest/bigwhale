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

const NODE_INFO = {
  trades: 'Every buy and sell — new entrants, swing traders, sellers — pays the same 5% fee. Sells pay you too.',
  fee: 'Collected automatically at execution and converted to XRP. This is the sole source of holder rewards.',
  holders: '4/5 of every fee, airdropped every hour to every holder based on how much they hold. The passive income engine.',
  liquidity: '1/5 of every fee deepens the trading pool, tightening spreads for everyone.',
  reserve: 'The $1M treasury sits apart from this flow — never spent on rewards, always auditable.',
}

function FlowDiagram() {
  const [hover, setHover] = useState(null)
  const pTrades = 'M110,60 C170,60 170,120 230,120'
  const pHolders = 'M330,120 C400,120 400,70 460,70'
  const pLiquidity = 'M330,120 C400,120 400,170 460,170'
  const node = 'fill-[#0D142C] stroke-white/10'
  const hl = (k) => (hover === k ? { filter: 'brightness(1.6)' } : {})
  return (
    <div>
      <svg viewBox="0 0 580 300" className="h-auto w-full">
        <defs>
          <linearGradient id="resGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2E9BFF" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2E9BFF" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {[pTrades, pHolders, pLiquidity].map((p) => (
          <path key={p} d={p} fill="none" stroke="#2E9BFF" strokeOpacity="0.25" strokeWidth="1.5" />
        ))}

        {[
          { p: pTrades, dur: '2.6s', begin: '0s' },
          { p: pTrades, dur: '2.6s', begin: '1.3s' },
          { p: pHolders, dur: '2.2s', begin: '0.6s' },
          { p: pHolders, dur: '2.2s', begin: '1.7s' },
          { p: pLiquidity, dur: '2.8s', begin: '1s' },
        ].map((m, i) => (
          <circle key={i} r="3.2" fill="#2E9BFF">
            <animateMotion dur={m.dur} begin={m.begin} repeatCount="indefinite" path={m.p} />
          </circle>
        ))}

        <g
          className="cursor-pointer"
          style={hl('trades')}
          onMouseEnter={() => setHover('trades')}
          onMouseLeave={() => setHover(null)}
        >
          <rect x="20" y="36" width="90" height="48" rx="12" className={node} strokeWidth="1" />
          <text x="65" y="57" textAnchor="middle" fill="#A6B0C5" fontSize="11" fontFamily="Inter">
            Every trade
          </text>
          <text x="65" y="72" textAnchor="middle" fill="#606D89" fontSize="9" fontFamily="IBM Plex Mono">
            buys &amp; sells
          </text>
        </g>
        <g
          className="cursor-pointer"
          style={hl('fee')}
          onMouseEnter={() => setHover('fee')}
          onMouseLeave={() => setHover(null)}
        >
          <rect x="230" y="94" width="100" height="52" rx="12" fill="#0A4E96" fillOpacity="0.35" stroke="#2E9BFF" strokeOpacity="0.5" strokeWidth="1" />
          <text x="280" y="116" textAnchor="middle" fill="#E8ECF4" fontSize="12" fontWeight="600" fontFamily="Inter">
            5% fee
          </text>
          <text x="280" y="132" textAnchor="middle" fill="#66B8FF" fontSize="9" fontFamily="IBM Plex Mono">
            collected on-chain
          </text>
        </g>
        <g
          className="cursor-pointer"
          style={hl('holders')}
          onMouseEnter={() => setHover('holders')}
          onMouseLeave={() => setHover(null)}
        >
          <rect x="460" y="44" width="100" height="52" rx="12" className={node} strokeWidth="1" />
          <text x="510" y="66" textAnchor="middle" fill="#E8ECF4" fontSize="11" fontWeight="600" fontFamily="Inter">
            Holders
          </text>
          <text x="510" y="82" textAnchor="middle" fill="#66B8FF" fontSize="9" fontFamily="IBM Plex Mono">
            4/5 · hourly XRP
          </text>
        </g>
        <g
          className="cursor-pointer"
          style={hl('liquidity')}
          onMouseEnter={() => setHover('liquidity')}
          onMouseLeave={() => setHover(null)}
        >
          <rect x="460" y="144" width="100" height="52" rx="12" className={node} strokeWidth="1" />
          <text x="510" y="166" textAnchor="middle" fill="#E8ECF4" fontSize="11" fontWeight="600" fontFamily="Inter">
            Liquidity
          </text>
          <text x="510" y="182" textAnchor="middle" fill="#606D89" fontSize="9" fontFamily="IBM Plex Mono">
            1/5 · depth
          </text>
        </g>

        <g
          className="cursor-pointer"
          style={hl('reserve')}
          onMouseEnter={() => setHover('reserve')}
          onMouseLeave={() => setHover(null)}
        >
          <rect x="20" y="232" width="540" height="52" rx="14" fill="url(#resGlow)" stroke="#2E9BFF" strokeOpacity="0.35" strokeWidth="1">
            <animate attributeName="stroke-opacity" values="0.35;0.65;0.35" dur="4s" repeatCount="indefinite" />
          </rect>
          <text x="290" y="254" textAnchor="middle" fill="#E8ECF4" fontSize="12" fontWeight="600" fontFamily="Inter">
            $1,000,000 XRP Reserve
          </text>
          <text x="290" y="271" textAnchor="middle" fill="#A6B0C5" fontSize="9.5" fontFamily="IBM Plex Mono">
            standing treasury · publicly auditable · separate from the fee flow above
          </text>
        </g>
      </svg>
      <div className="mt-3 flex min-h-[2.5rem] items-center rounded-md border border-white/[0.06] bg-white/[0.02] px-4 py-2">
        <p className="text-xs leading-relaxed text-mist-dim">
          {hover ? (
            NODE_INFO[hover]
          ) : (
            <span className="text-mist-faint">Hover any node to see exactly what happens there.</span>
          )}
        </p>
      </div>
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

      <div className="relative mx-auto max-w-7xl px-6 py-28">
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
