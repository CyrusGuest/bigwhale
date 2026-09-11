import { motion } from 'framer-motion'

const sources = [
  {
    title: 'Trading fees',
    body: 'The 5% fee on completed XPY trades. This is the only inflow to the rewards pool.',
    included: true,
  },
]

const notSources = [
  { title: 'New buyers’ principal', body: 'Purchase capital is never routed to earlier holders. Rewards are funded exclusively by realized fees.' },
  { title: 'Token emissions', body: 'Supply is fixed. No new tokens are minted to simulate yield.' },
  { title: 'Lending or rehypothecation', body: 'Pooled XRP sits in the distribution wallet until it is airdropped. It is not lent, staked, or deployed anywhere.' },
  { title: 'Actual mining of any kind', body: 'XRP cannot be mined, the XRP Ledger has no mining. “Virtual mining” is our name for the fee-redistribution algorithm, not a claim that anything is mined. A project claiming to literally mine XRP for you is misrepresenting how the ledger works.' },
]

const ledgerLinks = [
  { label: 'XRP reserve address', value: 'Attestation pending', note: 'The $1M treasury, publishes when funded' },
  { label: 'Rewards pool address', value: 'rXPAYp00L…9fKq', note: 'Live balance, all inflows' },
  { label: 'Distribution history', value: '8,760 transactions', note: 'Every hourly airdrop since launch' },
  { label: 'Fee collection', value: 'Per-trade records', note: 'Each fee traceable to its trade' },
  { label: 'Token supply', value: 'Fixed at issuance', note: 'No mint authority retained' },
]

export default function Transparency() {
  return (
    <section id="transparency" className="border-y border-white/[0.07] bg-ink-850/40">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-2xl"
        >
          <p className="eyebrow mb-5">Transparency</p>
          <h2 className="font-serif text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
            Where rewards come from, and where they don’t.
          </h2>
          <p className="mt-5 leading-relaxed text-mist-dim">
            The clearest way to distinguish a real fee-sharing mechanism from a
            scheme is to account for every source of yield. Here is our full
            accounting.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.24em] text-azure">
              Funds rewards
            </h3>
            <div className="space-y-4">
              {sources.map((s) => (
                <div key={s.title} className="panel rounded-md border-l-2 border-l-azure p-6">
                  <h4 className="font-medium">{s.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-mist-dim">{s.body}</p>
                </div>
              ))}
            </div>

            <h3 className="mb-6 mt-10 font-mono text-[11px] uppercase tracking-[0.24em] text-mist-faint">
              Never funds rewards
            </h3>
            <div className="space-y-4">
              {notSources.map((s) => (
                <div key={s.title} className="rounded-md border border-white/[0.06] p-6">
                  <h4 className="font-medium text-mist-dim">
                    <span className="mr-3 font-mono text-mist-faint">✕</span>
                    {s.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-mist-faint">{s.body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.24em] text-brass">
              Verify on the ledger
            </h3>
            <div className="panel overflow-hidden rounded-md">
              <div className="divide-y divide-white/[0.05]">
                {ledgerLinks.map((l) => (
                  <a
                    key={l.label}
                    href="#"
                    className="group flex items-center justify-between gap-6 px-6 py-5 transition-colors hover:bg-ink-800"
                  >
                    <div>
                      <span className="block text-sm font-medium">{l.label}</span>
                      <span className="mt-0.5 block text-xs text-mist-faint">{l.note}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-mist-dim">{l.value}</span>
                      <span className="text-mist-faint transition-transform group-hover:translate-x-0.5">→</span>
                    </div>
                  </a>
                ))}
              </div>
              <div className="border-t border-white/[0.07] bg-ink-800/40 px-6 py-4 text-xs leading-relaxed text-mist-faint">
                These links open a public XRPL explorer. Nothing on this page
                requires trusting us, if a number here ever disagrees with the
                ledger, the ledger is right.
              </div>
            </div>

            <div className="mt-6 rounded-md border border-brass/25 bg-brass/[0.04] p-6">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-brass">
                What “virtual mining” means here
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-mist-dim">
                Virtual mining is our name for the distribution algorithm:
                like Bitcoin mining, it pays participants on a fixed rhythm in
                proportion to their stake in the system, but the resemblance
                is economic, not mechanical. Nothing is mined and no XRP is
                created. Rewards are a share of fees from real trading
                activity, and when trading slows, rewards slow with it. We use
                the familiar term, and we define it precisely, because you
                should understand the mechanism exactly, not just like the
                sound of it.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
