import { motion } from 'framer-motion'

const steps = [
  {
    num: 'I',
    title: 'Trade',
    tag: 'fee collected at execution',
    body: 'Every buy and sell of XTO carries a 4% fee, collected automatically at execution. This fee is the sole source of holder rewards, there are no token emissions, no inflation, and no yield generated from anyone’s principal.',
    spec: '4% per trade · Collected on-chain · Sole reward source',
  },
  {
    num: 'II',
    title: 'Pool',
    tag: 'fees converted to oil stock',
    body: 'Collected fees are converted to oil stock and held in a public rewards pool. All of each fee, 100%, is airdropped to holders as oil stock. The team holds XTO and earns the same way. The pool address is published, and its balance is verifiable by anyone at any time.',
    spec: '100% airdropped to holders · Team earns as holders · Public pool',
  },
  {
    num: 'III',
    title: 'Distribute',
    tag: 'hourly airdrop, split by holdings',
    body: 'Each hour, the pool is distributed to every wallet holding XTO, in proportion to its share of supply. Oil stock arrives directly in your wallet, no staking contract to enter, no claim button to press, no lockup to exit. Each distribution is an ordinary on-chain transaction you can inspect.',
    spec: 'Split by holdings · Direct to wallet · Every transaction public',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="mb-16 max-w-2xl"
      >
        <p className="eyebrow mb-5">Virtual Drilling</p>
        <h2 className="font-serif text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
          Trade. Pool. Get paid.
        </h2>
        <p className="mt-5 leading-relaxed text-mist-dim">
          Bitcoin pays miners for hashpower, funded by newly issued coins.
          XTO&rsquo;s virtual drilling algorithm pays you for holding, funded
          by trading fees. Same reward loop, a far better seat: no rigs, no
          leases, no roughnecks. Three steps, all on a public ledger.
        </p>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-lg border border-white/[0.06] bg-white/[0.03] p-8 transition-colors duration-300 hover:border-gold/25"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-3xl text-brass">{s.num}</span>
              <span className="font-mono text-[10px] tracking-[0.05em] text-mist-faint">{s.tag}</span>
            </div>
            <h3 className="mb-3 mt-6 text-lg font-medium">{s.title}</h3>
            <p className="flex-1 text-sm leading-relaxed text-mist-dim">{s.body}</p>
            <p className="mt-6 border-t border-white/[0.07] pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-mist-faint">
              {s.spec}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bitcoin mining vs virtual drilling */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-16 overflow-x-auto rounded-md border border-white/[0.08]"
      >
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-ink-800/80">
              <th className="px-6 py-5"> </th>
              <th className="px-6 py-5 text-[13px] font-medium text-mist-faint">Bitcoin mining</th>
              <th className="px-6 py-5 text-[13px] font-semibold text-mist">XTO virtual drilling</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['What you contribute', 'Hashpower, hardware and electricity', 'Holding the token in your own wallet'],
              ['Where rewards come from', 'Newly issued BTC plus transaction fees', 'Trading fees only, nothing new is created'],
              ['What is produced', 'New bitcoin enters circulation', 'Nothing is drilled; existing oil stock is redistributed'],
              ['Payout rhythm', 'Blocks roughly every 10 minutes', 'Payouts every hour, split by holdings'],
              ['Reward driver', 'Your share of network hashpower', 'Your share of supply × trading volume'],
              ['When activity stops', 'Difficulty adjusts; issuance continues', 'No volume, no fees, distributions pause'],
            ].map(([label, btc, xrpay]) => (
              <tr key={label} className="border-b border-white/[0.05] last:border-0">
                <td className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-mist-faint">
                  {label}
                </td>
                <td className="px-6 py-4 text-mist-dim">{btc}</td>
                <td className="border-l border-white/[0.06] bg-gold-deep/[0.10] px-6 py-4 font-medium text-mist">
                  {xrpay}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      <p className="mt-5 max-w-3xl font-mono text-[11px] leading-relaxed text-mist-faint">
        &ldquo;Virtual drilling&rdquo; is a metaphor, in the same family as
        &ldquo;liquidity mining.&rdquo; XTO owns no wells or rigs, pumps no
        barrels, and does not create, generate, or mint oil stock. The algorithm redistributes fees from real trading activity, which
        is why the last row of this table matters.
      </p>
    </section>
  )
}
