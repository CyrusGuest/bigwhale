import { motion } from 'framer-motion'
import { XrpMark } from './Hero.jsx'

const EASE = [0.22, 1, 0.36, 1]

function Float({ children, delay = 0, amt = 6, dur = 5, className = '' }) {
  return (
    <motion.div
      animate={{ y: [0, -amt, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function RefTeaser() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ type: 'spring', stiffness: 170, damping: 22 }}
        className="relative overflow-hidden rounded-[28px] p-8 ring-1 ring-azure/25 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.14)] sm:p-10"
        style={{
          background:
            'radial-gradient(130% 160% at 12% 0%, rgba(46,155,255,0.22) 0%, rgba(16,42,92,0.35) 45%, rgba(10,17,40,0.5) 100%)',
        }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-azure/[0.1] blur-[70px]" />

        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: [0, 1.15, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow mb-5"
            >
              Referrals
            </motion.p>
            <Float amt={5} dur={5.4}>
              <motion.h2
                initial={{ opacity: 0, x: -160 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: EASE }}
                className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
              >
                Invite friends. Earn{' '}
                <span className="relative inline-block">
                  <span className="text-shimmer">10% of their XRP.</span>
                  <span aria-hidden className="text-glint absolute inset-0">
                    10% of their XRP.
                  </span>
                </span>
              </motion.h2>
            </Float>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
              className="mt-3 max-w-md text-[15px] leading-relaxed text-mist-dim"
            >
              Every hour they get paid, you get a 10% match on top. Their
              payouts never shrink. Yours never stop.
            </motion.p>
            <motion.a
              href="#/referral"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
              className="mt-6 inline-block"
            >
              <motion.span
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center gap-2.5 rounded-full bg-azure px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-azure-bright hover:shadow-[0_0_36px_-8px_rgba(46,155,255,0.6)]"
              >
                See how referrals work →
              </motion.span>
            </motion.a>
          </div>

          {/* friends piping XRP to you, condensed */}
          <div className="hidden items-center justify-between gap-3 lg:flex">
            <div className="flex flex-col gap-3">
              {['🧑‍🚀', '🐋', '🦍'].map((e, i) => (
                <motion.span
                  key={e}
                  initial={{ opacity: 0, x: -60, scale: 0.6 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 240, damping: 18 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] text-lg ring-1 ring-white/[0.12] backdrop-blur"
                >
                  {e}
                </motion.span>
              ))}
            </div>
            <div className="relative h-24 flex-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 h-px overflow-hidden bg-gradient-to-r from-azure/10 via-azure/30 to-azure/10"
                  style={{ top: `${16 + i * 34}%` }}
                >
                  <motion.span
                    animate={{ left: ['-10%', '105%'] }}
                    transition={{
                      duration: 1.3,
                      repeat: Infinity,
                      ease: 'easeIn',
                      delay: 0.8 + i * 0.4,
                    }}
                    className="absolute top-1/2 h-[3px] w-3 -translate-y-1/2 rounded-full bg-azure shadow-[0_0_8px_2px_rgba(46,155,255,0.7)]"
                  />
                </div>
              ))}
            </div>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 220, damping: 16 }}
              className="relative flex h-14 w-14 items-center justify-center rounded-full text-white ring-1 ring-azure/50 shadow-[0_0_30px_-6px_rgba(46,155,255,0.7)]"
              style={{
                background:
                  'radial-gradient(120% 120% at 50% 0%, rgba(46,155,255,0.65) 0%, rgba(16,42,92,0.95) 60%, #0A1128 100%)',
              }}
            >
              <motion.span
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="pointer-events-none absolute -inset-1 rounded-full border border-azure/40"
              />
              <XrpMark className="h-6 w-6" strokeWidth={4.5} />
            </motion.span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
