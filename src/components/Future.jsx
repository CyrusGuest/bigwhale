import { motion } from 'framer-motion'
import { XrpMark } from './Hero.jsx'

const EASE = [0.22, 1, 0.36, 1]

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

const BURST = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2
  return { x: Math.cos(a) * 90, y: Math.sin(a) * 70, r: 100 + i * 40 }
})

const pairs = [
  {
    name: 'XPY / XRP',
    glyph: null, // XrpMark
    status: 'Live now',
    live: true,
    body: 'The flagship. Hold XPY and get paid XRP every hour, backed by the $1,000,000 starting reserve. This is the pair you are looking at.',
  },
  {
    name: 'XPY / BTC',
    glyph: '₿',
    status: 'In development',
    live: false,
    body: 'Passively earn Bitcoin. Same algorithm, same hourly payouts, a new pair with its own reserve behind it.',
  },
  {
    name: 'XPY / ETH',
    glyph: 'Ξ',
    status: 'Planned',
    live: false,
    body: 'Ethereum sent to your wallet while you sleep. The playbook proven on XRP, pointed at the second-largest asset in crypto.',
  },
  {
    name: 'More pairs',
    glyph: '···',
    status: 'Chosen with holders',
    live: false,
    body: 'Solana, gold-backed assets, whatever holders want to earn next. The platform decides its future with the people it pays.',
  },
]

export default function Future() {
  return (
    <section id="future" className="relative mx-auto max-w-7xl overflow-x-clip px-6 py-28">
      {/* header: lines slam in from opposite sides */}
      <div className="mb-14 text-center lg:text-left">
        <motion.p
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: [0, 1.15, 1] }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow mb-6"
        >
          The Platform
        </motion.p>
        <Float amt={6} dur={5.5}>
          <motion.h2
            initial={{ opacity: 0, x: -220 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: EASE }}
            className="text-4xl font-bold tracking-[-0.03em] sm:text-6xl"
          >
            The virtual mining platform
          </motion.h2>
        </Float>
        <Float delay={0.4} amt={7} dur={5}>
          <motion.h2
            initial={{ opacity: 0, x: 220 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.15, duration: 0.55, ease: EASE }}
            className="text-4xl font-bold tracking-[-0.03em] sm:text-6xl"
          >
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-azure to-azure-bright bg-clip-text text-transparent">
                of the future.
              </span>
              <span aria-hidden className="text-glint absolute inset-0">
                of the future.
              </span>
            </span>
          </motion.h2>
        </Float>
        <motion.p
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.4, duration: 0.55, ease: EASE }}
          className="mx-auto mt-6 max-w-2xl leading-relaxed text-mist-dim lg:mx-0"
        >
          XPY is bigger than one coin. The algorithm paying XRP to holders
          today is built to run on any asset. XRP came first because this is
          our home ecosystem. Bitcoin comes next. Every new pair is another
          way to passively earn the assets you actually want, sent to your
          wallet while you sleep.
        </motion.p>
      </div>

      {/* roadmap rail with a traveling pulse, behind the cards */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-8 top-1/2 hidden lg:block">
          <div className="h-px bg-gradient-to-r from-azure/0 via-azure/25 to-azure/0" />
          <motion.span
            animate={{ left: ['1%', '99%'] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-azure shadow-[0_0_14px_3px_rgba(46,155,255,0.7)]"
          />
        </div>

        <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pairs.map((p, i) => (
            <Float key={p.name} delay={0.6 + i * 0.45} amt={5} dur={4.6 + i * 0.5}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 ? 280 : -280, rotate: i % 2 ? 5 : -5 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.13, type: 'spring', stiffness: 190, damping: 21 }}
                className={`relative flex h-full flex-col rounded-lg p-7 ${
                  p.live
                    ? 'border border-azure/40 bg-azure-deep/[0.12]'
                    : 'border border-white/[0.06] bg-white/[0.03] transition-colors hover:border-azure/25'
                }`}
              >
                {p.live && (
                  <>
                    {/* breathing glow + sonar ring on the live pair */}
                    <motion.span
                      animate={{ opacity: [0.4, 0.9, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="pointer-events-none absolute -inset-px rounded-lg shadow-[0_0_50px_-14px_rgba(46,155,255,0.55)]"
                    />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.35, 0], scale: [0.9, 1.12] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                      className="pointer-events-none absolute -inset-1 rounded-xl border border-azure/40"
                    />
                    {/* one-time XRP-mark burst when it lands */}
                    <span className="pointer-events-none absolute left-1/2 top-1/2">
                      {BURST.map((b, j) => (
                        <motion.span
                          key={j}
                          initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                          whileInView={{ opacity: [0, 1, 0], x: b.x, y: b.y, rotate: b.r }}
                          viewport={{ once: true, margin: '-60px' }}
                          transition={{ delay: 0.45, duration: 0.7, ease: 'easeOut' }}
                          className="absolute text-azure"
                        >
                          <XrpMark className="h-4 w-4" strokeWidth={4} />
                        </motion.span>
                      ))}
                    </span>
                  </>
                )}

                <div className="relative flex items-center justify-between">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-medium ${
                      p.live
                        ? 'border border-azure/50 bg-ink-900 text-azure'
                        : 'border border-white/10 bg-ink-900 text-mist-dim'
                    }`}
                  >
                    {p.glyph ? p.glyph : <XrpMark className="h-5 w-5" strokeWidth={4} />}
                  </span>
                  <motion.span
                    animate={p.live ? {} : { opacity: [0.55, 1, 0.55] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
                    className={`rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] ${
                      p.live
                        ? 'border border-azure/40 bg-azure/10 text-azure-bright'
                        : 'border border-white/10 bg-white/[0.04] text-mist-faint'
                    }`}
                  >
                    {p.live && (
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-azure align-middle"
                      />
                    )}
                    {p.status}
                  </motion.span>
                </div>
                <h3 className="relative mb-2.5 mt-6 font-mono text-base font-medium tracking-tight">
                  {p.name}
                </h3>
                <p className="relative flex-1 text-sm leading-relaxed text-mist-dim">{p.body}</p>
                {p.live && (
                  <a
                    href="#drip"
                    className="relative mt-5 font-mono text-xs text-azure transition-colors hover:text-azure-bright"
                  >
                    See it earning →
                  </a>
                )}
              </motion.div>
            </Float>
          ))}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-8 font-mono text-[11px] text-mist-faint"
      >
        Roadmap, not launch dates. Each new pair ships when its reserve and
        liquidity are in place, and never before.
      </motion.p>
    </section>
  )
}
