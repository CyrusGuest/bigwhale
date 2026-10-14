import { motion } from 'framer-motion'
import { REVEAL } from '../motionPrefs.js'

const EASE = [0.22, 1, 0.36, 1]

// headline figures, U.S. Energy Information Administration, 2023 data
const FACTS = [
  { value: '38%', label: 'of all U.S. energy comes from petroleum', sub: 'The largest single source' },
  { value: '#1', label: 'crude oil producer in the world', sub: 'The United States, every year since 2018' },
  { value: '~20M', label: 'barrels consumed in America every day', sub: 'Fuel, freight, farms, factories' },
  { value: '9 in 10', label: 'miles traveled run on petroleum', sub: 'Cars, trucks, planes, ships' },
]


// illustrative growth curves: XTO price and a holder's accumulated $USO,
// both plotted against holder count. Shapes only; not a forecast.
const W = 640
const H = 260
const PAD = { l: 14, r: 14, t: 18, b: 34 }
const MILESTONES = ['1,000', '10,000', '100,000', '1,000,000']

function curve(points) {
  const x = (i) => PAD.l + (i / (points.length - 1)) * (W - PAD.l - PAD.r)
  const y = (v) => H - PAD.b - v * (H - PAD.t - PAD.b)
  return points
    .map((v, i) => {
      if (i === 0) return `M ${x(0)} ${y(v)}`
      const px = x(i - 1)
      const cx = (px + x(i)) / 2
      return `C ${cx} ${y(points[i - 1])}, ${cx} ${y(v)}, ${x(i)} ${y(v)}`
    })
    .join(' ')
}

const PRICE = [0.06, 0.09, 0.12, 0.17, 0.22, 0.3, 0.38, 0.5, 0.63, 0.8, 0.96]
const OIL = [0.02, 0.05, 0.09, 0.14, 0.2, 0.28, 0.37, 0.48, 0.6, 0.74, 0.9]

function GrowthChart() {
  const priceD = curve(PRICE)
  const oilD = curve(OIL)
  const baseY = H - PAD.b
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full text-mist" role="img" aria-label="Illustration: as holders grow, XTO price and your $USO position both rise">
      <defs>
        <linearGradient id="oilFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#32E7D0" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#32E7D0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={PAD.l} x2={W - PAD.r} y1={baseY - g * (H - PAD.t - PAD.b)} y2={baseY - g * (H - PAD.t - PAD.b)} stroke="currentColor" strokeOpacity="0.07" />
      ))}
      <line x1={PAD.l} x2={W - PAD.r} y1={baseY} y2={baseY} stroke="currentColor" strokeOpacity="0.25" />
      {/* holder milestones */}
      {MILESTONES.map((m, i) => {
        const x = PAD.l + ((i + 1) / (MILESTONES.length + 0.4)) * (W - PAD.l - PAD.r)
        return (
          <g key={m}>
            <line x1={x} x2={x} y1={baseY} y2={baseY + 5} stroke="currentColor" strokeOpacity="0.35" />
            <text x={x} y={baseY + 20} textAnchor="middle" fontSize="10" fontFamily="IBM Plex Mono, monospace" fill="currentColor" fillOpacity="0.55" letterSpacing="1">
              {m}
            </text>
          </g>
        )
      })}
      {/* your $USO: filled area */}
      <motion.path
        d={`${oilD} L ${W - PAD.r} ${baseY} L ${PAD.l} ${baseY} Z`}
        fill="url(#oilFill)"
        initial={REVEAL ? { opacity: 0 } : false}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d={oilD}
        fill="none"
        stroke="#32E7D0"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={REVEAL ? { pathLength: 0 } : false}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 1.6, ease: 'easeInOut' }}
      />
      {/* XTO price */}
      <motion.path
        d={priceD}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={REVEAL ? { pathLength: 0 } : false}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 1.6, ease: 'easeInOut' }}
      />
      {/* end markers */}
      <motion.circle cx={W - PAD.r} cy={baseY - 0.96 * (H - PAD.t - PAD.b)} r="4.5" fill="currentColor" initial={REVEAL ? { scale: 0, opacity: 0 } : false} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.9, duration: 0.3 }} style={{ transformOrigin: `${W - PAD.r}px ${baseY - 0.96 * (H - PAD.t - PAD.b)}px` }} />
      <motion.circle cx={W - PAD.r} cy={baseY - 0.9 * (H - PAD.t - PAD.b)} r="4.5" fill="#32E7D0" initial={REVEAL ? { scale: 0, opacity: 0 } : false} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2.5, duration: 0.3 }} style={{ transformOrigin: `${W - PAD.r}px ${baseY - 0.9 * (H - PAD.t - PAD.b)}px` }} />
    </svg>
  )
}

const fade = (delay = 0) => ({
  initial: REVEAL ? { opacity: 0, y: 24, filter: 'blur(8px)' } : false,
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-80px' },
  transition: { delay, duration: 0.8, ease: EASE },
})

export default function Powers() {
  return (
    <section id="oil" className="relative border-t border-navy/[0.07]">
      <div className="breathe pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-blue/[0.08] blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <motion.p {...fade()} className="eyebrow">
              Why oil
            </motion.p>
            <motion.h2
              {...fade(0.08)}
              className="mt-6 font-serif text-4xl font-semibold tracking-[-0.015em] sm:text-5xl"
            >
              Oil is what powers America.
            </motion.h2>
            <motion.p {...fade(0.16)} className="mt-6 text-lg leading-relaxed text-mist-dim">
              Oil is a multi-trillion dollar industry — and for decades,
              foreign cartels and corrupt eastern monopolies have fought to
              corner it and set the price from overseas.
            </motion.p>
            <motion.p {...fade(0.24)} className="mt-5 text-lg leading-relaxed text-mist-dim">
              XTO is the only coin competing to bring that industry into
              crypto. The first mover, making history: America already pumps
              more oil than any nation on earth, and XTO puts that lead
              on-chain — in front of China and every cartel trying to own the
              market. Hold the coin and the algorithm pays you real $USO,
              every hour. No other coin is even in this race.
            </motion.p>
          </div>

          <div className="grid content-start gap-4 sm:grid-cols-2">
            {FACTS.map((f, i) => (
              <motion.div key={f.value} {...fade(0.1 + i * 0.08)} className="card p-7">
                <div className="font-serif text-5xl font-semibold tabular-nums tracking-[-0.02em] text-gold">
                  {f.value}
                </div>
                <p className="mt-4 text-[15px] font-medium leading-snug text-mist">{f.label}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-mist-faint">
                  {f.sub}
                </p>
              </motion.div>
            ))}
            <motion.p
              {...fade(0.5)}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint sm:col-span-2"
            >
              Source: U.S. Energy Information Administration, 2023 data
            </motion.p>
          </div>
        </div>

        {/* the growth loop: more holders → XTO grows → your oil position grows */}
        <motion.div {...fade(0.1)} className="mt-20 grid gap-10 rounded-lg border border-gold/25 bg-gold/[0.05] p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Our goal</p>
            <h3 className="mt-5 font-serif text-3xl font-semibold tracking-[-0.015em] sm:text-4xl">
              Grow XTO. Grow your oil position with it.
            </h3>
            <p className="mt-5 leading-relaxed text-mist-dim">
              Every new American who joins adds trading. Every trade pays the
              fee. And every fee buys $USO for the people already holding.
              As the program grows, XTO is built to grow in value with it, and
              your passively earned $USO climbs right alongside.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-mist">
              <li className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-mist" /> XTO price, as holders grow
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-gold" /> Your $USO, earned every hour
              </li>
            </ul>
          </div>
          <div>
            <div className="rounded-lg border border-navy/[0.07] bg-paper/70 p-4 sm:p-6">
              <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-mist-faint">
                <span>Value</span>
                <span>Holders →</span>
              </div>
              <GrowthChart />
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-mist-faint">
              Illustration of how the program is designed to work. Not a forecast; prices can fall.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
