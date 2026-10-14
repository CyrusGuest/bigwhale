import { motion } from 'framer-motion'
import Stars from './Stars.jsx'
import { REVEAL } from '../motionPrefs.js'
import ContractAddress, { BUY_URL } from './ContractAddress.jsx'

export default function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden border-t border-navy/[0.07]">
      <div className="breathe pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/[0.08] blur-[140px]" />

      <motion.div
        initial={REVEAL ? { opacity: 0, y: 24, filter: 'blur(8px)' } : false}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-3xl px-6 py-32 text-center"
      >
        <Stars className="mb-8" />
        <p className="eyebrow mb-6">Join the movement</p>
        <h2 className="font-serif text-4xl font-medium tracking-[-0.01em] sm:text-6xl">
          The oil market, open to
          <br />
          every American.
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-mist-dim">
          Oil powers this country, and for too long only a few earned from
          it. Hold XTO and get your piece: $USO, paid to you every hour,
          without paying today’s high price for a single barrel or share.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href={BUY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Join the Movement · Buy XTO
          </a>
          <a href="#faq" className="btn-secondary">Read the Risks</a>
        </div>
        <div className="mt-6 flex justify-center">
          <ContractAddress />
        </div>
        <p className="mx-auto mt-10 max-w-lg border-t border-navy/[0.08] pt-6 text-xs leading-relaxed text-mist-faint">
          XTO is a speculative digital asset. Distributions vary with trading
          volume, may be zero, and are not income guarantees. The token’s price
          can decline regardless of rewards. Nothing on this site constitutes
          financial, investment, or tax advice.
        </p>
      </motion.div>
    </section>
  )
}
