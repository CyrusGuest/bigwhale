import { motion } from 'framer-motion'
import { REVEAL } from '../motionPrefs.js'

const EASE = [0.22, 1, 0.36, 1]

const fade = (delay = 0) => ({
  initial: REVEAL ? { opacity: 0, y: 24, filter: 'blur(8px)' } : false,
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-80px' },
  transition: { delay, duration: 0.8, ease: EASE },
})

// the on-chain token XTO pays out: Ondo Global Markets' tokenized USO share
const USOON_MINT = 'rpydAzWdCy85HEmoQkH5PVxYtDYQWjmLxgHHadxondo'

// the chain from a barrel of oil to your wallet, one layer per card
const LAYERS = [
  {
    num: 'I',
    title: 'Crude oil',
    kicker: 'WTI, the American benchmark',
    body: 'West Texas Intermediate is the grade of crude that prices America’s oil. It trades as monthly futures contracts on the NYMEX, and that futures price is what the whole world quotes when it says "oil is up today."',
  },
  {
    num: 'II',
    title: '$USO, the fund',
    kicker: 'United States Oil Fund · NYSE Arca: USO',
    body: 'USO is the largest and oldest oil ETF in America, trading since 2006. It holds the front-month WTI futures contract, backed by cash and Treasury bills, and rolls into the next month before each contract expires. One share is a slice of that position.',
  },
  {
    num: 'III',
    title: 'USOon, the token',
    kicker: 'Tokenized by Ondo Global Markets',
    body: 'USOon is a Solana token that represents USO shares held in custody, one token for one share. It carries the fund’s price on-chain, so it can be bought, sold, and sent like any other token, around the clock, without a brokerage account.',
  },
  {
    num: 'IV',
    title: 'Your wallet',
    kicker: 'Hourly, in plain dollars',
    body: 'Every hour, the fees from XTO trading buy USOon on-chain and send it straight to every holder, split by holdings. You see dollars; what lands is a token that moves with the price of oil. Keep it, or sell it on Jupiter whenever you like.',
  },
]

const FACTS = [
  ['Fund', 'United States Oil Fund LP'],
  ['Ticker', 'USO on NYSE Arca'],
  ['Holds', 'Front-month WTI crude futures'],
  ['Sponsor', 'USCF, since April 2006'],
  ['Token', 'USOon on Solana'],
  ['Issuer', 'Ondo Global Markets'],
]

export default function Underlying() {
  return (
    <section id="uso" className="relative overflow-x-clip border-t border-navy/[0.07] bg-ink-850/40">
      <div className="breathe pointer-events-none absolute right-[-200px] top-10 hidden h-[520px] w-[520px] rounded-full bg-gold/[0.10] blur-[150px] md:block" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28">
        <div className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          {/* the explanation; min-w-0 so the unbreakable mint address below cannot widen the column */}
          <div className="min-w-0">
            <motion.p {...fade()} className="eyebrow">
              The underlying
            </motion.p>
            <motion.h2
              {...fade(0.08)}
              className="mt-6 font-serif text-4xl font-semibold leading-[1.1] tracking-[-0.015em] sm:text-5xl"
            >
              What you are actually paid in.
            </motion.h2>
            <motion.p {...fade(0.16)} className="mt-6 text-lg leading-relaxed text-mist-dim">
              Every payout arrives as <span className="font-semibold text-mist">USOon</span>: a token on
              Solana that mirrors <span className="font-semibold text-mist">$USO</span>, the United States
              Oil Fund. USO is the fund Wall Street uses to own oil without taking delivery of a single
              barrel. Its price rises and falls with American crude, and USOon carries that price on-chain,
              one token for one share.
            </motion.p>
            <motion.p {...fade(0.22)} className="mt-5 leading-relaxed text-mist-dim">
              So the chain is short: oil moves, the fund moves, the token moves, and your wallet holds more
              of it every hour. No broker, no account minimums, no trading-hours window. The same exposure
              a fund manager buys, sent to you in pieces.
            </motion.p>

            <motion.div {...fade(0.28)} className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {FACTS.map(([k, v]) => (
                <div key={k}>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-mist-faint">
                    {k}
                  </span>
                  <span className="mt-1 block text-[13px] font-medium leading-snug text-mist">{v}</span>
                </div>
              ))}
            </motion.div>

            <motion.a
              {...fade(0.34)}
              href={`https://solscan.io/token/${USOON_MINT}`}
              target="_blank"
              rel="noreferrer"
              className="mt-8 flex w-fit max-w-full items-center gap-3 rounded-sm border border-navy/10 bg-paper px-4 py-2.5 font-mono text-[11px] text-mist-dim transition-colors hover:border-gold/40 hover:text-mist"
            >
              <span className="flex-none text-gold-deep">USOon</span>
              <span className="min-w-0 truncate">{USOON_MINT}</span>
              <span className="flex-none text-mist-faint">Solscan ↗</span>
            </motion.a>
          </div>

          {/* the chain, barrel to wallet */}
          <div className="relative">
            <div className="pointer-events-none absolute bottom-10 left-[27px] top-10 w-px bg-gradient-to-b from-gold/0 via-gold/50 to-gold/0 sm:left-[31px]" />
            <div className="space-y-4">
              {LAYERS.map((l, i) => (
                <motion.div key={l.num} {...fade(0.1 + i * 0.1)} className="card relative flex gap-5 p-6 sm:p-7">
                  <span className="relative flex h-14 w-14 flex-none items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-serif text-xl text-gold sm:h-16 sm:w-16">
                    {l.num}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-2xl font-semibold text-mist">{l.title}</h3>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold-deep">
                      {l.kicker}
                    </p>
                    <p className="mt-3 leading-relaxed text-mist-dim">{l.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* what moves the price, and what to know */}
        <motion.div
          {...fade(0.2)}
          className="relative mt-14 overflow-hidden rounded-xl bg-gradient-to-br from-gold/[0.09] via-gold/[0.03] to-transparent p-6 sm:p-8"
        >
          <div className="breathe pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-gold/[0.12] blur-[90px]" />
          <div className="relative grid gap-8 md:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-deep">What moves it</p>
              <p className="mt-3 text-sm leading-relaxed text-mist-dim">
                The front-month WTI futures price. Supply cuts, demand, inventories, and geopolitics all
                show up in that number, and USO follows it day to day.
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-deep">Why it is not spot oil</p>
              <p className="mt-3 text-sm leading-relaxed text-mist-dim">
                The fund rolls contracts every month. When the next month costs more than the one expiring,
                the roll costs a little, so over long stretches USO can drift below the headline oil price.
                It also charges a management fee, under one percent a year.
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-deep">What to know</p>
              <p className="mt-3 text-sm leading-relaxed text-mist-dim">
                USOon is a token, not a brokerage share: no voting, no tax forms from the fund, and its
                on-chain price can sit away from USO when liquidity is thin. Oil can fall, and so can
                everything that tracks it.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
