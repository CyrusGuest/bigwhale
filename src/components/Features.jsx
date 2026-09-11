import { motion } from 'framer-motion'

const features = [
  {
    num: '01',
    title: 'Paid in XRP, not the token',
    body: 'Rewards arrive as XRP, a liquid, widely listed asset, rather than more of the token itself. Your reward is immediately spendable and its value does not depend on XPY’s own price at the moment you receive it.',
    spec: 'Native XRP airdrops · No reward token · Immediately liquid',
  },
  {
    num: '02',
    title: 'Everyone gets their fair share',
    body: 'Distribution is proportional to holdings at the ledger snapshot, computed the same way for every wallet. A wallet holding 0.1% of supply receives 0.1% of the holder pool. There are no tiers, boosts, referral multipliers, or team preferences.',
    spec: 'One rule · Every wallet · No preferential tiers',
  },
  {
    num: '03',
    title: 'Nothing to stake or claim',
    body: 'Holding in a self-custodied XRPL wallet is the only requirement. There is no staking contract that can be exploited, no claim deadline to miss, and no lockup standing between you and your assets. Sell any time; you simply stop receiving future distributions.',
    spec: 'Self-custody · No lockups · Exit any time',
  },
  {
    num: '04',
    title: 'Verifiable, not trusted',
    body: 'The pool address, every inbound fee, and every outbound distribution are ordinary XRPL transactions. You can audit the entire history yourself with a block explorer, the numbers on this site are a convenience, not the source of truth.',
    spec: 'Public pool · Public distributions · Audit it yourself',
  },
  {
    num: '05',
    title: 'Rewards scale with volume',
    body: 'This cuts both ways, and we say so plainly: distributions are funded by trading fees, so they rise when trading is active and shrink when it is quiet. In a period of zero volume, distributions are zero. No mechanism can promise otherwise.',
    spec: 'Volume-linked · Variable · Can be zero',
  },
  {
    num: '06',
    title: 'No principal is ever touched',
    body: 'Rewards come from realized fees on completed trades, never from new buyers’ principal, never from emissions, never from lending out pooled funds. If the fee revenue isn’t there, the distribution simply is not made.',
    spec: 'Fees only · No emissions · No rehypothecation',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="mb-16 max-w-2xl"
      >
        <p className="eyebrow mb-5">Design Principles</p>
        <h2 className="font-serif text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
          Simple enough to verify.
        </h2>
        <p className="mt-5 leading-relaxed text-mist-dim">
          Reward mechanisms fail when they are too complex to audit. XPY’s
          is one rule applied hourly, and every one of these properties can be
          checked against the ledger.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group flex flex-col rounded-lg border border-white/[0.06] bg-white/[0.03] p-8 transition-colors duration-300 hover:border-azure/25 hover:bg-white/[0.05]"
          >
            <span className="font-mono text-[11px] text-brass">{f.num}</span>
            <h3 className="mb-3 mt-5 text-lg font-medium tracking-tight">{f.title}</h3>
            <p className="flex-1 text-sm leading-relaxed text-mist-dim">{f.body}</p>
            <p className="mt-6 border-t border-white/[0.07] pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-mist-faint">
              {f.spec}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
