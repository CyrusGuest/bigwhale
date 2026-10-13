import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { REVEAL } from '../motionPrefs.js'

const faqs = [
  {
    q: 'What is XTO, in one sentence?',
    a: 'XTO is the first crypto coin that pays you $USO (US Oil Fund) just for holding it. Every hour, a slice of every trade is turned into $USO and sent to every holder, split by how much each person holds. It is the simplest way an American has ever had to build a position in oil.',
  },
  {
    q: 'What do I actually get paid?',
    a: '$USO, the US Oil Fund, shown to you in plain dollars. A $40 payout is $40 worth of $USO, sitting in your wallet. Keep it and let it grow, or sell it whenever you like. It is yours the moment it lands.',
  },
  {
    q: 'Where does the money come from?',
    a: 'From trading. Every buy or sell of XTO pays a 4% fee, and 100% of that fee is turned into $USO and paid out to holders every hour. The team holds XTO too, and earns exactly the way you do: same rules, same hourly payouts, no special cut. Nothing is printed, and nothing comes from new buyers’ money. Real trading, real $USO.',
  },
  {
    q: 'Why is it good to get in early?',
    a: 'Because every trade made after you buy in pays you. The earlier you hold, the more trades you collect from. As more Americans discover XTO and start trading, the fee pool grows, your hourly payouts grow with it, and so does the $USO position you are building.',
  },
  {
    q: 'Do I have to do anything?',
    a: 'No. Buy XTO, keep it in your own wallet, and the payouts arrive on their own, around the clock. Nothing to stake, nothing to lock, nothing to claim. If you ever sell, the payouts stop, and you keep every dollar of $USO you already earned.',
  },
  {
    q: 'What makes XTO different from every other coin?',
    a: 'Other coins pay you in more of themselves. XTO pays you in something real: $USO, the US Oil Fund, a stake in the industry that powers America and the world economy. No other crypto coin has ever done this. Our distribution algorithm, what we call virtual drilling, turns every trade into $USO for holders, automatically, every hour.',
  },
  {
    q: 'Is anything actually being drilled?',
    a: 'No wells, no rigs. “Virtual drilling” is our name for the payout system: like a producing well, it pays out steadily to everyone with a stake. The fuel is trading activity, not crude in the ground, and that is exactly why it can pay every hour of every day.',
  },
  {
    q: 'What happens when trading slows down?',
    a: 'Payouts move with trading. A busy hour means a bigger payout; a quiet hour means a smaller one. That is what makes the rewards real: they come from actual activity, not from printing coins. And it is why growing the movement grows everyone’s payouts.',
  },
  {
    q: 'What are the risks?',
    a: 'XTO is a crypto coin, not a security. It is purely a coin running on an algorithm that pays its holders back in $USO, which is what sets it apart from most other coins. But it is still crypto, and crypto comes with the same ground rules as every other coin: there are no promises from the team, there is no roadmap, and prices are extremely volatile compared to a regular stock. The price can fall, trading can slow, and payouts can shrink with it. Put in what you are comfortable holding through the swings. XTO is not a security.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
      <motion.div
        initial={REVEAL ? { opacity: 0, y: 20, filter: 'blur(8px)' } : false}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14"
      >
        <p className="eyebrow mb-5">Frequently Asked</p>
        <h2 className="font-serif text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
          Asked directly, answered directly.
        </h2>
      </motion.div>

      <div className="divide-y divide-navy/[0.07] border-y border-navy/[0.07]">
        {faqs.map((f, i) => {
          const isOpen = open === i
          return (
            <motion.div
              key={f.q}
              initial={REVEAL ? { opacity: 0, y: 14, filter: 'blur(6px)' } : false}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
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
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
