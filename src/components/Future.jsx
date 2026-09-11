import { motion } from 'framer-motion'
import { XrpMark } from './Hero.jsx'

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
    <section id="future" className="relative mx-auto max-w-7xl px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="mb-14 max-w-2xl"
      >
        <p className="eyebrow mb-6">The Platform</p>
        <h2 className="text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
          The virtual mining platform
          <br />
          <span className="bg-gradient-to-r from-azure to-azure-bright bg-clip-text text-transparent">
            of the future.
          </span>
        </h2>
        <p className="mt-6 leading-relaxed text-mist-dim">
          XPY is bigger than one coin. The algorithm paying XRP to holders
          today is built to run on any asset. XRP came first because this is
          our home ecosystem. Bitcoin comes next. Every new pair is another
          way to passively earn the assets you actually want, sent to your
          wallet while you sleep.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pairs.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`flex flex-col rounded-lg p-7 ${
              p.live
                ? 'border border-azure/40 bg-azure-deep/[0.12] shadow-[0_0_50px_-18px_rgba(46,155,255,0.5)]'
                : 'border border-white/[0.06] bg-white/[0.03] transition-colors hover:border-azure/25'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-medium ${
                  p.live
                    ? 'border border-azure/50 bg-ink-900 text-azure'
                    : 'border border-white/10 bg-ink-900 text-mist-dim'
                }`}
              >
                {p.glyph ? p.glyph : <XrpMark className="h-5 w-5" strokeWidth={4} />}
              </span>
              <span
                className={`rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] ${
                  p.live
                    ? 'border border-azure/40 bg-azure/10 text-azure-bright'
                    : 'border border-white/10 bg-white/[0.04] text-mist-faint'
                }`}
              >
                {p.status}
              </span>
            </div>
            <h3 className="mb-2.5 mt-6 font-mono text-base font-medium tracking-tight">
              {p.name}
            </h3>
            <p className="flex-1 text-sm leading-relaxed text-mist-dim">{p.body}</p>
            {p.live && (
              <a
                href="#drip"
                className="mt-5 font-mono text-xs text-azure transition-colors hover:text-azure-bright"
              >
                See it earning →
              </a>
            )}
          </motion.div>
        ))}
      </div>

      <p className="mt-6 font-mono text-[11px] text-mist-faint">
        Roadmap, not launch dates. Each new pair ships when its reserve and
        liquidity are in place, and never before.
      </p>
    </section>
  )
}
