import { motion } from 'framer-motion'
import { OilMark } from './Hero.jsx'
import Stars from './Stars.jsx'

const EASE = [0.22, 1, 0.36, 1]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { delay, duration: 0.7, ease: EASE },
})

const STEPS = [
  {
    num: 'I',
    title: 'Hold XPY',
    body: 'Buy XPY. Keep it in your wallet. That is the whole job.',
  },
  {
    num: 'II',
    title: 'Get paid every hour',
    body: 'Once an hour, $USO is sent straight to your wallet. You see it as dollars: $40 one hour, $55 the next. Hold more XPY and each payout gets bigger.',
  },
  {
    num: 'III',
    title: 'Watch it add up',
    body: 'Every payout is more $USO in your name. Hold longer, and you build a real stake in the industry that powers America, without buying a single share yourself.',
  },
]

// the fee loop, left to right
const FLOW = [
  ['Someone trades XPY', 'They pay a 4% fee'],
  ['The fee buys $USO', 'All of it, every time'],
  ['Every hour, it is split', 'Among everyone holding XPY'],
  ['It lands in your wallet', 'Automatically'],
]

const FACTS = [
  ['You get paid in', '$USO'],
  ['How often', 'Every hour'],
  ['Your share', '4% of every trade'],
  ['What you do', 'Nothing. Just hold.'],
  ['Backed by', '$1,000,000 in $USO, held in reserve'],
]

export default function Explainer() {
  return (
    <section id="how" className="relative border-t border-navy/[0.07]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-blue/[0.08] blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-28">
        {/* the claim */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.p {...fade()} className="eyebrow">
            A movement for the American people
          </motion.p>
          <motion.h2
            {...fade(0.08)}
            className="mt-6 font-serif text-4xl font-semibold leading-[1.1] tracking-[-0.015em] sm:text-5xl lg:text-6xl"
          >
            The first crypto coin that pays you{' '}
            <span className="text-shimmer">$USO</span>. Passively, all day.
          </motion.h2>
          <motion.p {...fade(0.16)} className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-mist-dim">
            Oil prices are near record highs. Buying barrels, or shares in the
            companies that pump them, is out of reach for most American
            families. XPY opens the door: hold the coin, and the oil market pays
            you in $USO (US Oil Fund), every hour, with no big check up front.
          </motion.p>
          <motion.p {...fade(0.22)} className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-mist-dim">
            No broker, no minimums, no waiting. Hour by hour, XPY lets
            everyday Americans build a portfolio of $USO easier than ever,
            and own a real piece of the industry that built this country.
          </motion.p>
          <motion.div {...fade(0.28)}>
            <Stars className="mt-10" />
          </motion.div>
        </div>

        {/* three steps */}
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div key={s.num} {...fade(0.1 + i * 0.1)} className="card p-8">
              <span className="font-serif text-3xl text-gold">{s.num}</span>
              <h3 className="mt-5 font-serif text-2xl font-semibold text-mist">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-mist-dim">{s.body}</p>
            </motion.div>
          ))}
        </div>

        {/* the loop */}
        <motion.div {...fade(0.2)} className="mt-14 rounded-lg border border-gold/25 bg-gold/[0.05] p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-deep">
            Where your payout comes from
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {FLOW.map(([k, v], i) => (
              <div key={k} className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-sm border border-gold/40 bg-gold/10 text-gold">
                    {i === FLOW.length - 1 ? (
                      <OilMark className="h-4 w-4" strokeWidth={4} />
                    ) : (
                      <span className="font-mono text-[11px] font-medium">{i + 1}</span>
                    )}
                  </span>
                  {i < FLOW.length - 1 && (
                    <span className="hidden h-px flex-1 bg-gradient-to-r from-gold/40 to-gold/10 sm:block" />
                  )}
                </div>
                <p className="mt-4 text-[15px] font-medium text-mist">{k}</p>
                <p className="mt-1 text-sm text-mist-dim">{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 border-t border-gold/15 pt-5 text-sm leading-relaxed text-mist-dim">
            Being early pays. Every single trade of XPY made after you buy in
            sends $USO to your wallet. As more Americans discover the
            program and start trading, your payouts grow with it. The earlier
            you hold, the more of that growth you collect.
          </p>
        </motion.div>

        {/* key facts */}
        <motion.dl
          {...fade(0.25)}
          className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-navy/[0.08] pt-8 sm:grid-cols-5"
        >
          {FACTS.map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist-faint">{k}</dt>
              <dd className="mt-1.5 text-base font-medium text-mist">{v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
