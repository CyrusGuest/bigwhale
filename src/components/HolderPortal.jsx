import { motion } from 'framer-motion'

const previewStats = [
  ['XPY balance', '4,281,904', 'tokens'],
  ['Share of supply', '0.4282%', 'of 1B supply'],
  ['Est. daily earnings', '1,278.2 XRP', '≈ $1,712.80 at $10M avg volume'],
  ['Received, 30 days', '38,346 XRP', '≈ $51,384'],
]

export default function HolderPortal() {
  return (
    <section id="portal" className="border-y border-white/[0.07] bg-ink-850/40">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow mb-5">Holder Portal</p>
            <h2 className="font-serif text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
              See your XPY work for you.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-mist-dim">
              A bank-account-style dashboard for your position: your balance,
              every payout, and your earning pace, laid out so simply you can
              check it daily. Easy, transparent navigation built to help you
              make the best moves. Read-only, the portal never asks you to
              connect or sign anything.
            </p>
            <a href="#/portal" className="btn-primary mt-9">
              Open the Portal →
            </a>
          </motion.div>

          <motion.a
            href="#/portal"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="group block"
          >
            <div className="panel panel-hover overflow-hidden rounded-md">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint">
                  7xKXtg…gAsU
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
                  Sample view
                </span>
              </div>
              <div className="grid grid-cols-2 gap-px bg-white/[0.06]">
                {previewStats.map(([label, value, sub]) => (
                  <div key={label} className="bg-ink-850 p-5">
                    <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-mist-faint">
                      {label}
                    </span>
                    <span className="mt-1.5 block font-serif text-xl font-medium tabular-nums text-mist">
                      {value}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-mist-faint">{sub}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.07] px-5 py-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-mist-dim transition-colors group-hover:text-mist">
                Track your wallet →
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
