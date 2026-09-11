import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'Is anything actually being mined?',
    a: 'No, and we say so everywhere the term appears. XRP cannot be mined: the XRP Ledger has no mining, and all XRP was created at the ledger’s launch. “Virtual mining” is our name for the distribution algorithm, used the way DeFi uses “liquidity mining”: a familiar metaphor for a reward loop. The economics resemble mining, regular payouts, proportional to your stake, but the fuel is trading fees on the token, not new coins. Be wary of any project that claims to literally mine XRP for you; that mechanism does not exist.',
  },
  {
    q: 'When will I earn back what I put in?',
    a: 'We don’t know, and neither does anyone else, so we won’t publish a payback target. Distributions depend entirely on trading volume, which varies unpredictably and can fall to zero. The token’s market price also moves independently of rewards, so your position can lose value faster than rewards add up. Treat XPY as a speculative asset whose rewards are a variable bonus, not as an income product with a schedule.',
  },
  {
    q: 'Where exactly does the XRP come from?',
    a: 'From the 5% fee charged on each completed trade of the token. Fees are converted to XRP and pooled; four fifths of each fee is sent to holders each hour based on how much they hold, and one fifth funds liquidity. No part of any reward comes from new buyers’ principal, token emissions, or lending out pooled funds, the pool’s inflows and outflows are public XRPL transactions you can audit.',
  },
  {
    q: 'What happens when trading volume falls?',
    a: 'Distributions fall with it, proportionally and immediately. An hour with little trading produces a small airdrop; an hour with none produces none. This is the honest cost of a mechanism funded by real activity rather than by inflation or new deposits, the rewards are genuine precisely because they are not guaranteed.',
  },
  {
    q: 'Do I need to stake, lock, or claim anything?',
    a: 'No. Hold XPY in a self-custodied XRPL wallet and distributions arrive automatically. There is no staking contract, no claim interface, and no lockup period. If you sell, you simply stop receiving future distributions, nothing you have already received is affected.',
  },
  {
    q: 'What are the risks?',
    a: 'The principal ones: the token’s price can fall, including to near zero; trading volume, and therefore rewards, can dry up; smart-contract and operational failures are possible despite public auditability; and regulatory treatment of fee-redistribution tokens is unsettled in most jurisdictions, which could affect exchange listings or your local ability to hold it. Only commit funds you can afford to lose entirely. Nothing on this site is financial advice.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="mb-14"
      >
        <p className="eyebrow mb-5">Frequently Asked</p>
        <h2 className="font-serif text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
          Asked directly, answered directly.
        </h2>
      </motion.div>

      <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {faqs.map((f, i) => {
          const isOpen = open === i
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className={`font-medium tracking-tight transition-colors ${isOpen ? 'text-mist' : 'text-mist-dim'}`}>
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex-none font-mono text-lg ${isOpen ? 'text-brass' : 'text-mist-faint'}`}
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-3xl pb-7 text-sm leading-relaxed text-mist-dim">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
