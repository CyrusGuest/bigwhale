import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { XrpMark } from './Hero.jsx'

const XRP_PRICE = 1.34
const RESERVE_USD = 1000000
const RESERVE_XRP = Math.round(RESERVE_USD / XRP_PRICE)

function CountUp({ target, prefix = '', suffix = '', duration = 2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    let frame
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / (duration * 1000), 1)
      setValue(target * (1 - Math.pow(1 - t, 4)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
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
  trades: 'Every buy and sell, new entrants, swing traders, sellers, pays the same 5% fee. Sells pay you too.',
  fee: 'Collected automatically at execution and converted to XRP. This is the sole source of holder rewards.',
  holders: '4/5 of every fee, airdropped every hour to every holder based on how much they hold. The passive income engine.',
  liquidity: '1/5 of every fee deepens the trading pool, tightening spreads for everyone.',
  reserve: 'The $1M treasury sits apart from this flow, never spent on rewards, always auditable.',
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

      {/* connecting paths */}
      {[pTrades, pHolders, pLiquidity].map((p) => (
        <path key={p} d={p} fill="none" stroke="#2E9BFF" strokeOpacity="0.25" strokeWidth="1.5" />
      ))}

      {/* traveling pulses */}
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

      {/* nodes */}
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

      {/* reserve foundation */}
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
    body: 'Distributions are funded by trading fees, never by drawing down the reserve, and never by new buyers’ principal. The reserve is credibility, not the faucet.',
  },
]

export default function Reserve() {
  return (
    <section id="reserve" className="relative overflow-hidden border-y border-white/[0.06]">
      <div className="pointer-events-none absolute -left-64 top-0 h-[480px] w-[720px] rounded-full bg-azure-deep/[0.18] blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow mb-6">First Mover</p>
            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-6xl sm:leading-[1.05]">
              The future coin of the
              <br />
              <span className="bg-gradient-to-r from-azure to-azure-bright bg-clip-text text-transparent">
                XRP ecosystem.
              </span>
            </h2>
            <p className="mt-6 text-xl font-medium text-mist">
              Our first coin: XPY with XRP, backed by a $1,000,000 starting
              reserve of XRP.
            </p>
            <p className="mt-4 max-w-lg leading-relaxed text-mist-dim">
              Nobody else pairs a seven-figure XRP treasury, sitting on the
              public ledger for anyone to audit, with an algorithm that pays
              holders every hour. XPY does. The fees pay you. The reserve
              stands behind the project: our thank-you to the XRP ecosystem we
              are building in, and our proof of long-term commitment. XPY with
              XRP is only the first pair. The platform is just getting
              started.
            </p>
            <p className="mt-4 font-mono text-[11px] text-mist-faint">
              First of its kind as far as we can find. If another project has
              done this, show us.
            </p>

            <div className="mt-9 flex items-end gap-8">
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-azure-bright">
                  Starting reserve
                </span>
                <span className="mt-1 block text-4xl font-semibold tabular-nums tracking-tight text-mist [text-shadow:0_0_40px_rgba(46,155,255,0.35)] sm:text-7xl">
                  <CountUp target={RESERVE_USD} prefix="$" />
                </span>
              </div>
              <div className="pb-2">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-mist-faint">
                  ≈ XRP held
                </span>
                <span className="mt-1 block text-2xl font-medium tabular-nums text-azure-bright">
                  <CountUp target={RESERVE_XRP} suffix=" XRP" />
                </span>
              </div>
            </div>

            <div className="panel mt-9 flex max-w-lg items-center justify-between gap-5 rounded-md px-6 py-5">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-azure/40 bg-ink-900 text-azure">
                  <XrpMark className="h-5 w-5" strokeWidth={4} />
                </span>
                <div>
                  <span className="block font-mono text-xs text-mist">
                    Reserve address
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] text-mist-faint">
                    Publishes at funding · attestation pending
                  </span>
                </div>
              </div>
              <span className="border border-brass/40 bg-brass/[0.06] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-brass">
                Pending
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="panel rounded-lg p-6 sm:p-8"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] font-medium text-mist">Where value flows</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint">
                Live mechanism
              </span>
            </div>
            <FlowDiagram />
          </motion.div>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-7 transition-colors hover:border-azure/25"
            >
              <span className="font-mono text-[11px] text-azure">0{i + 1}</span>
              <h3 className="mb-2.5 mt-4 font-medium tracking-tight">{p.title}</h3>
              <p className="text-sm leading-relaxed text-mist-dim">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
