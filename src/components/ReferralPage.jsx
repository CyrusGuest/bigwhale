import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XrpMark } from './Hero.jsx'

const EASE = [0.22, 1, 0.36, 1]
const XRP_PRICE = 1.34
const DAILY_RATE = 0.08 // $10M avg volume × 4% ÷ $5M mcap
const REF_CUT = 0.1 // you earn 10% of what your referrals earn

const SOL_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

function Float({ children, delay = 0, amt = 7, dur = 5, className = '' }) {
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

// repeating word-wave so still text keeps living
function WaveWords({ words, big = [], delay = 1.2 }) {
  return words.map((w, i) => (
    <motion.span
      key={i}
      animate={{
        scale: [1, big.includes(i) ? 1.3 : 1.14, 1],
        color: ['#66B8FF', '#FFFFFF', '#66B8FF'],
      }}
      transition={{
        delay: delay + i * 0.13,
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 1.7,
        ease: 'easeInOut',
      }}
      className="inline-block origin-center"
    >
      {w}
    </motion.span>
  ))
}

const BURST = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2
  return { x: Math.cos(a) * (110 + (i % 3) * 40), y: Math.sin(a) * (80 + (i % 2) * 30), r: 120 + i * 36 }
})

const glass =
  'rounded-[28px] bg-white/[0.055] backdrop-blur-2xl ring-1 ring-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.16)]'

const usd = (n, d = 0) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: d })
const num = (n, d = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

/* ------------------------------- intro acts -------------------------------- */

function ActTitle() {
  return (
    <motion.div
      exit={{ opacity: 0, y: -46, scale: 0.97, transition: { duration: 0.35, ease: EASE } }}
      className="relative w-full px-4 text-center"
    >
      <Float amt={8} dur={5} delay={1.6}>
        <div className="relative">
          <motion.span
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 0.7, 0], scale: [0.3, 1.4, 1.8] }}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-[min(88vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-azure/25 blur-3xl"
          />
          <span className="pointer-events-none absolute left-1/2 top-1/2">
            {BURST.map((b, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.3, rotate: 0 }}
                animate={{ opacity: [0, 1, 0], x: b.x, y: b.y, scale: 0.9, rotate: b.r }}
                transition={{ delay: 0.5, duration: 0.75, ease: 'easeOut' }}
                className="absolute text-azure"
              >
                <XrpMark className="h-5 w-5" strokeWidth={4} />
              </motion.span>
            ))}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-5">
            <motion.span
              initial={{ x: '-70vw', rotate: -14, opacity: 0 }}
              animate={{ x: 0, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 230, damping: 16 }}
              className="text-3d inline-block text-6xl font-bold tracking-[-0.03em] sm:text-8xl"
            >
              REFER.
            </motion.span>
            <motion.span
              initial={{ x: '70vw', rotate: 14, opacity: 0 }}
              animate={{ x: 0, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.24, type: 'spring', stiffness: 230, damping: 16 }}
              className="text-3d inline-block text-6xl font-bold tracking-[-0.03em] sm:text-8xl"
            >
              <span className="text-shimmer">EARN.</span>
            </motion.span>
          </div>
        </div>
      </Float>
      <Float delay={0.5} amt={5} dur={5.5}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6, ease: EASE }}
          className="mt-8 flex flex-wrap justify-center gap-x-2 font-mono text-sm uppercase tracking-[0.22em] text-azure-bright"
        >
          <WaveWords
            words={['10%', 'of', 'everything', 'your', 'friends', 'earn']}
            big={[0, 5]}
            delay={1.5}
          />
        </motion.p>
      </Float>
    </motion.div>
  )
}

/* --------------------------- two-phone walkthrough -------------------------- */

function MiniPhone({ children, className = '' }) {
  return (
    <div className={`relative w-[246px] ${className}`}>
      <div className="relative rounded-[2.6rem] bg-gradient-to-b from-[#55607a] via-[#2a3147] to-[#171c2e] p-[3px] shadow-[0_30px_76px_-16px_rgba(0,0,0,0.8),0_0_60px_-18px_rgba(46,155,255,0.45)]">
        {/* side buttons */}
        <div className="absolute -left-[2px] top-[86px] h-6 w-[2.5px] rounded-l-full bg-gradient-to-b from-[#5b6680] to-[#2a3147]" />
        <div className="absolute -left-[2px] top-[118px] h-10 w-[2.5px] rounded-l-full bg-gradient-to-b from-[#5b6680] to-[#2a3147]" />
        <div className="absolute -left-[2px] top-[162px] h-10 w-[2.5px] rounded-l-full bg-gradient-to-b from-[#5b6680] to-[#2a3147]" />
        <div className="absolute -right-[2px] top-[128px] h-14 w-[2.5px] rounded-r-full bg-gradient-to-b from-[#5b6680] to-[#2a3147]" />
        <div className="rounded-[2.4rem] bg-black p-[7px]">
          <div className="relative h-[466px] overflow-hidden rounded-[2rem] bg-[#0A1128]">
            <div className="pointer-events-none absolute -top-10 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-azure-deep/50 blur-[50px]" />
            {/* glass glare */}
            <div className="pointer-events-none absolute -left-16 -top-8 h-[140%] w-24 rotate-12 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
            {/* status bar */}
            <div className="absolute right-3.5 top-3 z-20 flex items-center gap-1 text-white/55">
              <svg viewBox="0 0 18 12" className="h-[7px] w-[11px] fill-current">
                <rect x="0" y="8" width="3" height="4" rx="0.8" />
                <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" />
                <rect x="9" y="3" width="3" height="9" rx="0.8" />
                <rect x="13.5" y="0.5" width="3" height="11.5" rx="0.8" opacity="0.4" />
              </svg>
              <svg viewBox="0 0 16 12" className="h-[7px] w-[9px] fill-current">
                <path d="M8 9.7a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2ZM8 5.6c1.8 0 3.4.7 4.6 1.9l-1.5 1.5A4.4 4.4 0 0 0 8 7.8c-1.2 0-2.3.5-3.1 1.2L3.4 7.5A6.5 6.5 0 0 1 8 5.6ZM8 1.5c2.9 0 5.5 1.2 7.4 3l-1.5 1.5A8.4 8.4 0 0 0 8 3.6c-2.3 0-4.4.9-5.9 2.4L.6 4.5c1.9-1.8 4.5-3 7.4-3Z" />
              </svg>
              <span className="flex h-[8px] w-[15px] items-center rounded-[2px] border border-white/40 px-[1.5px]">
                <span className="h-[4px] w-[70%] rounded-[1px] bg-white/80" />
              </span>
            </div>
            {/* dynamic island with camera */}
            <div className="absolute left-1/2 top-2.5 z-20 flex h-[17px] w-[70px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10151f] ring-1 ring-white/[0.08]" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function TypeText({ text, start, speed = 55 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const timers = text.split('').map((_, i) => setTimeout(() => setN(i + 1), start + i * speed))
    return () => timers.forEach(clearTimeout)
  }, [text, start, speed])
  return <>{text.slice(0, n)}</>
}

// big floating +XRP: drifts up and away like an ember on the wind
function PopAmt({ amt, big = false }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10, x: 0, scale: 0.45, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0.75, 0.4, 0],
        y: [10, -28, -74, -120, -158, -195],
        x: [0, 8, -10, 14, -4, 18],
        rotate: [0, 3, -4, 5, -2, 6],
        scale: [0.45, 1, big ? 1.4 : 1.2, big ? 1.7 : 1.45, big ? 1.95 : 1.65, big ? 2.15 : 1.8],
      }}
      transition={{ duration: 2.8, ease: 'easeInOut', times: [0, 0.12, 0.32, 0.55, 0.78, 1] }}
      className="pointer-events-none absolute -top-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap font-display text-3xl font-bold text-[#30D158] drop-shadow-[0_0_16px_rgba(48,209,88,0.7)]"
    >
      +{amt} XRP
    </motion.span>
  )
}

// in-screen notification banner, silky drop like a real lock screen
function ScreenNotif({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -44, scale: 0.86, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 1,
        opacity: { duration: 0.4, ease: 'easeOut' },
        filter: { duration: 0.35, ease: 'easeOut' },
      }}
      className="absolute inset-x-2 top-6 z-10 flex items-center gap-2 rounded-2xl bg-[#1d1f27]/90 p-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl"
    >
      <span
        className="flex h-7 w-7 flex-none items-center justify-center rounded-[8px] text-white"
        style={{
          background:
            'radial-gradient(130% 105% at 50% 0%, rgba(46,155,255,0.55) 0%, rgba(16,40,88,0.95) 48%, #05080F 100%)',
        }}
      >
        <XrpMark className="h-3.5 w-3.5" strokeWidth={5} />
      </span>
      <div className="min-w-0">
        <span className="block text-[10px] font-semibold text-white">XPY</span>
        <span className="block text-[10px] leading-tight text-white/80">{text}</span>
      </div>
    </motion.div>
  )
}

const PHONE_BEATS = [5200, 6200, 8200, 9000, 11400, 12200, 13400]

function ActPhones() {
  const [beat, setBeat] = useState(0)
  // headline dodge is desktop flair only; on mobile it would push off-screen
  const [dodge] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 640 ? 0 : -140,
  )
  useEffect(() => {
    const timers = PHONE_BEATS.map((t, i) => setTimeout(() => setBeat(i + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [])

  // tiles mirror the latest payout exactly, so they always match the floats
  const bLatest = beat >= 5 ? 20 : beat >= 3 ? 10 : 0
  const aLatest = beat >= 6 ? 2 : beat >= 4 ? 1 : 0

  return (
    <motion.div
      exit={{ opacity: 0, y: -46, transition: { duration: 0.35, ease: EASE } }}
      className="w-full px-4 text-center"
    >
      <Float amt={5} dur={5}>
        {/* slides left while the featured phone is big, recenters when both phones show */}
        <motion.h2
          initial={{ opacity: 0, y: 26, x: dodge, rotate: dodge ? -2 : 0, filter: 'blur(8px)' }}
          animate={{
            opacity: 1,
            y: 0,
            x: beat >= 2 ? 0 : dodge,
            rotate: beat >= 2 || !dodge ? 0 : -2,
            filter: 'blur(0px)',
          }}
          transition={{
            duration: 0.5,
            ease: EASE,
            x: { type: 'spring', stiffness: 140, damping: 20 },
            rotate: { type: 'spring', stiffness: 140, damping: 20 },
          }}
          className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-5xl"
        >
          Watch how it{' '}
          <span className="relative inline-block">
            <span className="text-shimmer">works.</span>
            <span aria-hidden className="text-glint absolute inset-0">
              works.
            </span>
          </span>
        </motion.h2>
      </Float>

      <div className="relative mx-auto -mb-[205px] mt-4 flex h-[580px] max-w-xl origin-top scale-[0.62] items-center justify-center gap-8 sm:mb-0 sm:mt-6 sm:scale-100 sm:gap-16">
        {/* the invite flying across */}
        {beat >= 1 && beat < 3 && (
          <motion.span
            initial={{ opacity: 0, left: '28%', top: '38%', rotate: 0, scale: 0.7 }}
            animate={{
              opacity: [0, 1, 1, 0],
              left: ['28%', '46%', '66%'],
              top: ['38%', '18%', '34%'],
              rotate: [0, 22, 42],
              scale: [0.7, 1, 0.9],
            }}
            transition={{ duration: 1.15, ease: 'easeInOut' }}
            className="absolute z-30 rounded-full bg-azure px-3 py-1.5 font-mono text-[10px] font-semibold text-white shadow-[0_0_20px_rgba(46,155,255,0.8)]"
          >
            xpy.io/?ref=7xKX ✉
          </motion.span>
        )}

        {/* the 10% match pulse, friend → you */}
        {(beat === 4 || beat === 6) && (
          <motion.span
            key={`pulse-${beat}`}
            initial={{ opacity: 0, right: '22%', top: '30%' }}
            animate={{ opacity: [0, 1, 1, 0], right: ['22%', '48%', '74%'], top: ['30%', '14%', '30%'] }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
            className="absolute z-30 h-3 w-3 rounded-full bg-[#30D158] shadow-[0_0_16px_4px_rgba(48,209,88,0.8)]"
          />
        )}

        {/* Phone A: you — featured large for the walkthrough, then zooms out
            to make room when your friend's phone arrives */}
        <motion.div
          layout
          initial={{ opacity: 0, x: -260, rotate: -14, scale: 1.32 }}
          animate={{
            opacity: 1,
            x: 0,
            rotate: beat >= 2 ? -5 : -1.5,
            scale: beat >= 2 ? 1 : 1.32,
          }}
          transition={{
            delay: beat >= 2 ? 0 : 0.25,
            type: 'spring',
            stiffness: 160,
            damping: 21,
            layout: { type: 'spring', stiffness: 140, damping: 22 },
          }}
          style={{ transformOrigin: 'top center' }}
          className="relative"
        >
          {beat >= 4 && beat < 6 && <PopAmt key="a1" amt={1} />}
          {beat >= 6 && <PopAmt key="a2" amt={2} />}
          <Float amt={6} dur={4.6}>
            <MiniPhone>
              {beat >= 4 && (
                <ScreenNotif key={`an-${beat >= 6 ? 2 : 1}`} text={`+${beat >= 6 ? 2 : 1} XRP · referral match`} />
              )}
              <div className="px-3 pt-8 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-azure/15 text-azure">
                    <XrpMark className="h-3 w-3" strokeWidth={5.5} />
                  </span>
                  <span className="font-display text-[11px] font-bold text-white">XPY</span>
                  <span className="ml-auto rounded-full bg-white/[0.08] px-2 py-0.5 text-[8px] text-white/60">
                    Referrals
                  </span>
                </div>
                <p className="mt-4 font-display text-[13px] font-semibold leading-snug text-white">
                  Create your referral link
                </p>
                <div className="mt-2 rounded-xl bg-white/[0.07] px-2.5 py-2 font-mono text-[9px] text-azure-bright ring-1 ring-white/[0.1]">
                  <TypeText text="7xKXtg2CW8…gAsU" start={1800} speed={85} />
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                    className="text-white/70"
                  >
                    |
                  </motion.span>
                </div>
                <motion.div
                  initial={{ opacity: 0.6 }}
                  animate={beat >= 1 ? { scale: [1, 0.92, 1], opacity: 1 } : { opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative mt-2 rounded-xl bg-azure py-2 text-center text-[11px] font-bold text-white"
                >
                  {beat >= 1 ? 'Shared ✓' : 'Generate & Share'}
                  {beat >= 1 && (
                    <motion.span
                      initial={{ opacity: 0.6, scale: 0.4 }}
                      animate={{ opacity: 0, scale: 2 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 rounded-xl border-2 border-white/70"
                    />
                  )}
                </motion.div>

                <AnimatePresence>
                  {beat >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 16, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className="mt-3 rounded-xl bg-white/[0.06] p-2.5 ring-1 ring-white/[0.08]"
                    >
                      <span className="block text-[9px] text-white/55">Friends holding</span>
                      <span className="font-display text-[15px] font-bold text-white">1</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {aLatest > 0 && (
                    <motion.div
                      key={aLatest}
                      initial={{ scale: 1.35 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      className="mt-2 rounded-xl bg-[#30D158]/12 p-2.5 ring-1 ring-[#30D158]/30"
                    >
                      <span className="block text-[9px] text-white/55">Your 10% match</span>
                      <span className="font-display text-[15px] font-bold text-[#30D158]">
                        +{aLatest} XRP
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </MiniPhone>
          </Float>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-mist-faint">You</p>
        </motion.div>

        {/* Phone B: your friend */}
        {beat >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 220, scale: 0.5, rotate: 16 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 190, damping: 17 }}
            className="relative"
          >
            {beat >= 3 && beat < 5 && <PopAmt key="b10" amt={10} big />}
            {beat >= 5 && <PopAmt key="b20" amt={20} big />}
            <Float amt={6} dur={5.2} delay={0.4}>
              <MiniPhone>
                {beat >= 3 && (
                  <ScreenNotif key={`bn-${beat >= 5 ? 2 : 1}`} text={`You just got paid +${beat >= 5 ? 20 : 10} XRP`} />
                )}
                <div className="px-3 pt-8 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-azure/15 text-azure">
                      <XrpMark className="h-3 w-3" strokeWidth={5.5} />
                    </span>
                    <span className="font-display text-[11px] font-bold text-white">XPY</span>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-4 font-display text-[13px] font-semibold leading-snug text-white"
                  >
                    You&rsquo;re in 🎉
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="mt-2 rounded-xl bg-white/[0.06] p-2.5 ring-1 ring-white/[0.08]"
                  >
                    <span className="block text-[9px] text-white/55">Now holding</span>
                    <span className="font-display text-[15px] font-bold text-white">XPY</span>
                  </motion.div>
                  <AnimatePresence>
                    {bLatest > 0 && (
                      <motion.div
                        key={bLatest}
                        initial={{ scale: 1.35 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                        className="mt-2 rounded-xl bg-[#30D158]/12 p-2.5 ring-1 ring-[#30D158]/30"
                      >
                        <span className="block text-[9px] text-white/55">Latest payout</span>
                        <span className="font-display text-[15px] font-bold text-[#30D158]">
                          +{bLatest} XRP
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </MiniPhone>
            </Float>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-mist-faint">
              Your friend
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {beat >= 7 && (
          <Float amt={5} dur={5}>
            <motion.p
              initial={{ opacity: 0, scale: 1.6, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 flex flex-wrap justify-center gap-x-2.5 font-display text-2xl font-semibold text-white sm:text-3xl"
            >
              <WaveWords
                words={['They', 'earn.', 'You', 'earn', '10%', 'on', 'top.', 'Automatically.']}
                big={[4]}
                delay={0.8}
              />
            </motion.p>
          </Float>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// friends stream XRP, a cut flows to you, coins pop as they land
function ActFlow() {
  const [chips, setChips] = useState([])
  const [total, setTotal] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => {
      const amt = 0.3 + Math.random() * 0.7
      setChips((c) => [...c.slice(-2), { id: Date.now(), amt }])
      setTotal((t) => t + amt)
    }, 1100)
    return () => clearInterval(iv)
  }, [])
  return (
    <motion.div
      exit={{ opacity: 0, y: -46, transition: { duration: 0.35, ease: EASE } }}
      className="w-full px-4 text-center"
    >
      <Float amt={6} dur={5}>
        <motion.h2
          initial={{ opacity: 0, x: -240 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-4xl font-bold tracking-[-0.03em] sm:text-6xl"
        >
          They earn hourly.
        </motion.h2>
      </Float>
      <Float delay={0.3} amt={7} dur={5.4}>
        <motion.h2
          initial={{ opacity: 0, x: 240 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
          className="text-4xl font-bold tracking-[-0.03em] sm:text-6xl"
        >
          You earn <span className="text-shimmer">on top.</span>
        </motion.h2>
      </Float>

      {/* three friends piping XRP to you */}
      <div className="mx-auto mt-10 flex max-w-md items-center justify-between px-2">
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: -120, scale: 0.6 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.2, type: 'spring', stiffness: 240, damping: 18 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.08] text-lg ring-1 ring-white/[0.12] backdrop-blur"
            >
              {['🧑‍🚀', '🐋', '🦍'][i]}
            </motion.span>
          ))}
        </div>
        <div className="relative mx-4 h-28 flex-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px overflow-hidden bg-gradient-to-r from-azure/10 via-azure/30 to-azure/10"
              style={{ top: `${18 + i * 32}%` }}
            >
              <motion.span
                animate={{ left: ['-10%', '105%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeIn', delay: 1.3 + i * 0.35 }}
                className="absolute top-1/2 h-[3px] w-3 -translate-y-1/2 rounded-full bg-azure shadow-[0_0_8px_2px_rgba(46,155,255,0.7)]"
              />
            </div>
          ))}
        </div>
        <div className="relative">
          {/* +XRP coin popups as pulses land */}
          <AnimatePresence>
            {chips.map((c) => (
              <motion.span
                key={c.id}
                initial={{ opacity: 0, y: 0, scale: 0.6 }}
                animate={{ opacity: [0, 1, 1, 0], y: -54, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#30D158]/15 px-2.5 py-1 font-display text-[12px] font-bold text-[#30D158] ring-1 ring-[#30D158]/30"
              >
                +{c.amt.toFixed(2)} XRP
              </motion.span>
            ))}
          </AnimatePresence>
          <motion.span
            key={chips[chips.length - 1]?.id || 'you'}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative flex h-16 w-16 items-center justify-center rounded-full text-white ring-1 ring-azure/50 shadow-[0_0_36px_-6px_rgba(46,155,255,0.7)]"
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
            <span className="text-[13px] font-bold">YOU</span>
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[13px] font-semibold tabular-nums text-[#30D158]"
          >
            +{total.toFixed(2)} XRP
          </motion.span>
        </div>
      </div>

      <Float delay={0.9} amt={5} dur={5}>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.5 }}
          className="mx-auto mt-8 max-w-md text-lg text-mist-dim"
        >
          Their payouts never shrink. Your 10% is paid on top, from the 1/5
          marketing &amp; referral slice of the fee.
        </motion.p>
      </Float>
    </motion.div>
  )
}

/* ------------------------------ main content -------------------------------- */

function LinkCard() {
  const [input, setInput] = useState('')
  const [link, setLink] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!SOL_ADDRESS.test(trimmed)) {
      setError('That does not look like a valid Solana address (base58, 32-44 characters).')
      return
    }
    setError('')
    const base = `${window.location.origin}${window.location.pathname}`
    setLink(`${base}?ref=${trimmed.slice(0, 8)}`)
    setCopied(false)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 22 }}
      className={`${glass} mx-auto max-w-2xl p-7 sm:p-9`}
    >
      <h3 className="font-display text-[20px] font-semibold text-white">Get your link</h3>
      <p className="mt-1 text-[14px] text-white/55">
        Drop in your wallet, share the link, earn 10% of your friends&rsquo; hourly XRP.
      </p>
      <form onSubmit={submit} className="mt-5 flex overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-white/[0.12] focus-within:ring-azure/50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your Solana wallet address"
          spellCheck="false"
          className="w-full bg-transparent px-5 py-3.5 font-mono text-sm text-white placeholder:text-white/35 focus:outline-none"
        />
        <button
          type="submit"
          className="whitespace-nowrap bg-azure px-6 text-sm font-semibold text-white transition-colors hover:bg-azure-bright"
        >
          Generate
        </button>
      </form>
      {error && <p className="mt-3 text-xs text-brass">{error}</p>}
      <AnimatePresence>
        {link && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-azure/25"
          >
            <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-azure-bright">
              {link}
            </span>
            <button
              onClick={copy}
              className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-colors ${
                copied ? 'bg-[#30D158] text-ink-950' : 'bg-white text-ink-950 hover:bg-white/90'
              }`}
            >
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Earning XRP every hour just for holding XPY. Join with my link: ${link}`,
              )}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/[0.1] px-4 py-2 text-[12px] font-semibold text-white ring-1 ring-white/[0.12] transition-colors hover:bg-white/[0.16]"
            >
              Share on 𝕏
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-mist-faint">
        Referral tracking activates at token launch · Link format is final
      </p>
    </motion.div>
  )
}

function StepCards() {
  const steps = [
    { icon: '🔗', title: 'Share your link', body: 'Send it to friends, group chats, your feed. Anyone who buys through it is yours.' },
    { icon: '⏱️', title: 'They hold, they earn', body: 'Your friends get their full hourly XRP payouts. Nothing is taken from them, ever.' },
    { icon: null, title: 'You earn 10% on top', body: 'Every hour they earn, you earn a 10% match, paid from the 1/5 marketing & referral fee slice. For as long as they hold.' },
  ]
  return (
    <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-3">
      {steps.map((s, i) => (
        <Float key={s.title} delay={0.4 + i * 0.5} amt={5} dur={4.8 + i * 0.4}>
          <motion.div
            initial={{ opacity: 0, x: i === 1 ? 0 : i ? 260 : -260, y: i === 1 ? 60 : 0 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 200, damping: 21 }}
            className={`${glass} h-full p-6`}
          >
            <Float amt={4} dur={2.6} delay={i * 0.4}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.08] text-2xl ring-1 ring-white/[0.12]">
                {s.icon || <XrpMark className="h-5 w-5 text-azure" strokeWidth={4.5} />}
              </span>
            </Float>
            <h4 className="font-display mt-4 text-[17px] font-semibold text-white">
              {i + 1}. {s.title}
            </h4>
            <p className="mt-1.5 text-[14px] leading-relaxed text-white/55">{s.body}</p>
          </motion.div>
        </Float>
      ))}
    </div>
  )
}

/* ------------------------------ the virus act ------------------------------ */

// premium suited-executive silhouette: gradient suit, collar, tie, pocket square
function Person({ size = 34, hot = false }) {
  const gid = hot ? 'personHot' : 'personStd'
  return (
    <svg
      viewBox="0 0 40 46"
      width={size}
      height={size * 1.15}
      className={hot ? 'text-azure-bright' : 'text-azure'}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hot ? '#2E9BFF' : '#1B3B75'} stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0A1128" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="10" r="7.6" fill={`url(#${gid})`} stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.5 44 C4.5 30 11 24.5 20 24.5 C29 24.5 35.5 30 35.5 44 Z"
        fill={`url(#${gid})`}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 25.5 L20 31 L25.5 25.5"
        fill="none"
        stroke="#E8ECF4"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path d="M20 31 l2.2 3 -2.2 8.4 -2.2 -8.4 z" fill="currentColor" />
      <rect x="27.5" y="33.5" width="4.5" height="2" rx="0.6" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

// mitosis layout: generation g has 2^g figures; children emerge from parents
const GEN_SIZES = [64, 52, 42, 32, 24]

function genSlots(g) {
  const n = 2 ** g
  if (n <= 8) {
    return Array.from({ length: n }, (_, i) => ({
      x: (i + 0.5) * (320 / n) - 160,
      y: 8,
      size: GEN_SIZES[g],
    }))
  }
  return Array.from({ length: 16 }, (_, i) => {
    const r = i >= 8 ? 1 : 0
    const c = i % 8
    return { x: (c + 0.5) * 40 - 160, y: r ? 44 : -22, size: GEN_SIZES[4] }
  })
}

const VIRUS_WAVES = [800, 2400, 4000, 5600, 7200]
const VIRUS_COUNTS = [1, 2, 4, 8, 16]

function ActVirus() {
  const [wave, setWave] = useState(-1)
  const [slamPhase, setSlamPhase] = useState(0) // 1: virus slam, 2: ripple bangs it out
  useEffect(() => {
    const timers = VIRUS_WAVES.map((t, i) => setTimeout(() => setWave(i), t))
    timers.push(setTimeout(() => setSlamPhase(1), 8700))
    timers.push(setTimeout(() => setSlamPhase(2), 11000))
    return () => timers.forEach(clearTimeout)
  }, [])

  const slots = genSlots(Math.max(wave, 0))
  const parentSlots = wave > 0 ? genSlots(wave - 1) : genSlots(0)

  return (
    <motion.div
      exit={{ opacity: 0, y: -46, transition: { duration: 0.35, ease: EASE } }}
      className="w-full px-4 text-center"
    >
      <Float amt={5} dur={5}>
        <motion.p
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-xl font-medium text-mist sm:text-2xl"
        >
          Every movement starts with <span className="text-shimmer">one believer.</span>
        </motion.p>
      </Float>

      {/* live holder counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={wave >= 0 ? { opacity: 1, scale: [0, 1.15, 1] } : {}}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full bg-white/[0.07] px-4 py-1.5 ring-1 ring-white/[0.12] backdrop-blur"
      >
        <span className="text-[13px] text-white/55">Holders</span>
        <motion.span
          key={slamPhase > 0 ? '589' : wave}
          initial={{ scale: 1.5, color: '#30D158' }}
          animate={{ scale: 1, color: slamPhase > 0 ? '#30D158' : '#FFFFFF' }}
          transition={{ duration: 0.4 }}
          className="font-display text-[16px] font-bold tabular-nums"
        >
          {slamPhase > 0 ? '589+' : VIRUS_COUNTS[Math.max(wave, 0)]}
        </motion.span>
      </motion.div>

      {/* the mitosis */}
      <div className="relative mx-auto mt-6 h-[190px] w-[340px]">
        {/* ripple shockwave on every division */}
        {wave >= 1 && (
          <motion.span
            key={`ripple-${wave}`}
            initial={{ opacity: 0.55, scale: 0.15 }}
            animate={{ opacity: 0, scale: 2.2 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-azure/60 shadow-[0_0_30px_rgba(46,155,255,0.4)]"
          />
        )}

        {/* patient zero's phone lights up */}
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.6 }}
          animate={{ opacity: [0, 1, 1, 0], y: [14, -4, -8, -18], scale: [0.6, 1, 1, 0.9] }}
          transition={{ delay: 1.1, duration: 1.6, times: [0, 0.2, 0.75, 1] }}
          className="pointer-events-none absolute -top-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-xl bg-[#1d1f27]/95 px-2.5 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
        >
          <span
            className="flex h-5 w-5 items-center justify-center rounded-[6px] text-white"
            style={{
              background:
                'radial-gradient(130% 105% at 50% 0%, rgba(46,155,255,0.55) 0%, rgba(16,40,88,0.95) 48%, #05080F 100%)',
            }}
          >
            <XrpMark className="h-3 w-3" strokeWidth={5.5} />
          </span>
          <span className="text-[10px] font-semibold text-[#30D158]">+XRP every hour</span>
        </motion.div>

        <div className="absolute left-1/2 top-1/2">
          <AnimatePresence mode="popLayout">
            {wave >= 0 &&
              slots.map((s, i) => {
                const parent = parentSlots[Math.floor(i / 2)] || parentSlots[0]
                return (
                  <motion.div
                    key={`${wave}-${i}`}
                    initial={
                      wave === 0
                        ? { x: s.x, y: s.y, scale: 0, opacity: 0 }
                        : { x: parent.x, y: parent.y, scale: 0.55, opacity: 0.7 }
                    }
                    animate={{ x: s.x, y: s.y, scale: 1, opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.18 } }}
                    transition={{
                      delay: i * 0.045,
                      type: 'spring',
                      stiffness: 150,
                      damping: 16,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                  >
                    {wave === 0 && (
                      <motion.span
                        animate={{ opacity: [0.5, 0.15, 0.5], scale: [1, 1.35, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="pointer-events-none absolute -inset-1.5 rounded-full bg-azure/20 blur-[6px]"
                      />
                    )}
                    <Float amt={3} dur={2.6 + (i % 5) * 0.4} delay={0.4}>
                      <Person size={s.size} hot={wave === 0} />
                    </Float>
                  </motion.div>
                )
              })}
          </AnimatePresence>
        </div>

        {/* the slam, then the ripple line bangs it out */}
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {slamPhase === 1 && (
              <motion.div
                key="slam-virus"
                initial={{ opacity: 0, scale: 2.1, filter: 'blur(12px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{
                  x: -820,
                  rotate: -18,
                  opacity: 0,
                  filter: 'blur(8px)',
                  transition: { duration: 0.38, ease: [0.55, 0, 0.8, 0.4] },
                }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute flex items-center justify-center"
              >
                <span className="pointer-events-none absolute h-32 w-[380px] rounded-full bg-ink-950/90 blur-2xl" />
                <h2 className="text-3d relative text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl">
                  XPY SPREADS
                  <br />
                  <span data-text="LIKE A VIRUS." className="glitch inline-block text-white">
                    LIKE A VIRUS.
                  </span>
                </h2>
              </motion.div>
            )}
            {slamPhase === 2 && (
              <motion.div
                key="slam-ripple"
                initial={{ x: 720, rotate: 14, opacity: 0 }}
                animate={{ x: 0, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute flex items-center justify-center"
              >
                <span className="pointer-events-none absolute h-32 w-[400px] rounded-full bg-ink-950/90 blur-2xl" />
                {/* impact flash + shockwave as it collides */}
                <motion.span
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="pointer-events-none absolute h-36 w-[420px] rounded-full bg-white blur-3xl"
                />
                <motion.span
                  initial={{ opacity: 0.6, scale: 0.4 }}
                  animate={{ opacity: 0, scale: 1.7 }}
                  transition={{ delay: 0.12, duration: 0.55, ease: 'easeOut' }}
                  className="pointer-events-none absolute h-40 w-[440px] rounded-full border-2 border-azure/60 blur-[1px]"
                />
                <motion.h2
                  animate={{ x: [0, -9, 7, -4, 0] }}
                  transition={{ delay: 0.14, duration: 0.42, ease: 'easeOut' }}
                  className="text-3d relative text-3xl font-bold leading-[1.12] tracking-[-0.03em] text-white sm:text-4xl"
                >
                  We like to call it
                  <br />
                  <span data-text="THE RIPPLE EFFECT." className="glitch inline-block text-white">
                    THE RIPPLE EFFECT.
                  </span>
                </motion.h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Float delay={0.6} amt={5} dur={5.4}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 12.3, duration: 0.5, ease: EASE }}
          className="mx-auto mt-8 max-w-lg text-lg text-mist-dim sm:text-xl"
        >
          One becomes two. Two become four.{' '}
          <span className="inline-flex flex-wrap justify-center gap-x-1.5 font-semibold">
            <WaveWords
              words={['Everyone', 'earning', 'XRP', 'the', 'whole', 'way.']}
              big={[2]}
              delay={13}
            />
          </span>
        </motion.p>
      </Float>
    </motion.div>
  )
}

/* ------------------------------- momentum act ------------------------------ */

const MOMENTUM_WORDS = ['More holders.', 'More volume.', 'Bigger payouts.', 'More attention.']
const MOMENTUM_TIMES = [400, 1900, 3400, 4900, 6500]
const RISERS = [
  { x: '8%', size: 22, dur: 9, delay: 0 },
  { x: '22%', size: 14, dur: 12, delay: 2.5 },
  { x: '36%', size: 18, dur: 10, delay: 5 },
  { x: '58%', size: 15, dur: 11, delay: 1.2 },
  { x: '72%', size: 24, dur: 9.5, delay: 3.8 },
  { x: '88%', size: 16, dur: 12.5, delay: 6 },
]

function ActMomentum() {
  const [step, setStep] = useState(-1) // 0..3 words, 4 finale
  const [sub, setSub] = useState(false)
  useEffect(() => {
    const timers = MOMENTUM_TIMES.map((t, i) => setTimeout(() => setStep(i), t))
    timers.push(setTimeout(() => setSub(true), 7600))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <motion.div
      exit={{ opacity: 0, y: -46, transition: { duration: 0.35, ease: EASE } }}
      className="relative w-full px-4 text-center"
    >
      {/* XRP marks rising softly like embers, the whole act long */}
      {RISERS.map((r, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 260 }}
          animate={{ opacity: [0, 0.35, 0.35, 0], y: -320 }}
          transition={{
            duration: r.dur,
            delay: r.delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.15, 0.8, 1],
          }}
          className="pointer-events-none absolute top-1/2 text-azure"
          style={{ left: r.x, width: r.size, height: r.size }}
        >
          <XrpMark className="h-full w-full" strokeWidth={4} />
        </motion.span>
      ))}

      {/* escalating statements, each shoved out by the next */}
      <div className="relative flex h-[140px] items-center justify-center sm:h-[170px]">
        <AnimatePresence mode="popLayout">
          {step >= 0 && step < 4 && (
            <motion.h2
              key={step}
              initial={{ x: 480, opacity: 0, rotate: 5 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{
                x: -520,
                opacity: 0,
                rotate: -6,
                filter: 'blur(6px)',
                transition: { duration: 0.35, ease: [0.55, 0, 0.8, 0.4] },
              }}
              transition={{ type: 'spring', stiffness: 240, damping: 20 }}
              className="absolute font-display font-semibold tracking-[-0.03em] text-white"
              style={{ fontSize: `clamp(2rem, ${7 + step * 0.9}vw, ${3.2 + step * 0.5}rem)` }}
            >
              {MOMENTUM_WORDS[step]}
            </motion.h2>
          )}
          {step >= 4 && (
            <motion.h2
              key="finale"
              initial={{ scale: 1.6, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute font-display text-4xl font-semibold tracking-[-0.03em] sm:text-6xl"
            >
              <span className="relative inline-block">
                <span className="text-shimmer">The loop never stops.</span>
                <span aria-hidden className="text-glint absolute inset-0">
                  The loop never stops.
                </span>
              </span>
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      {/* the ignition line, pure type */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={sub ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <p className="mx-auto flex max-w-xl flex-wrap justify-center gap-x-2.5 text-xl font-medium text-mist-dim sm:text-2xl">
          <WaveWords
            words={['TikTok.', 'Instagram.', 'X.', 'A', 'launch', 'built', 'to', 'detonate', 'week', 'one.']}
            big={[0, 1, 2, 7]}
            delay={0.8}
          />
        </p>
        <p className="mt-4 text-[11px] text-mist-faint">
          Momentum is the design goal, never a guarantee.
        </p>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------- the flywheel ------------------------------ */

const WHEEL_NODES = [
  { pos: 'top', emoji: '🫂', label: 'More holders' },
  { pos: 'right', emoji: '📈', label: 'More volume' },
  { pos: 'bottom', emoji: '💸', label: 'Bigger payouts' },
  { pos: 'left', emoji: '📣', label: 'More attention' },
]

const WHEEL_BEATS = [
  'Every friend you bring becomes a holder.',
  'Every holder adds volume. Every trade feeds the pool.',
  'Bigger hourly payouts make XPY impossible to ignore. New holders pour in on their own.',
  'And the wheel spins faster. A community that funds its own growth, designed to be self-sustaining.',
]

const NODE_POS = {
  top: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
  right: 'right-0 top-1/2 translate-x-1/3 -translate-y-1/2',
  bottom: 'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2',
  left: 'left-0 top-1/2 -translate-x-1/3 -translate-y-1/2',
}

function ActFlywheel() {
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    const times = [400, 1900, 3400, 4900, 6500]
    const timers = times.map((t, i) => setTimeout(() => setBeat(i + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [])

  const fast = beat >= 4
  const orbitDots = fast ? [0, 0.45, 0.9, 1.35, 1.8] : beat >= 2 ? [0, 1.2] : [0]
  const orbitDur = fast ? '2.2s' : '4.6s'

  return (
    <motion.div
      exit={{ opacity: 0, y: -46, transition: { duration: 0.35, ease: EASE } }}
      className="mx-auto w-full max-w-6xl px-2"
    >
      <div className="mb-8 text-center">
        <Float amt={6} dur={5.5}>
          <motion.h2
            initial={{ opacity: 0, x: -220 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-5xl"
          >
            One wheel.
          </motion.h2>
        </Float>
        <Float delay={0.4} amt={7} dur={5}>
          <motion.h2
            initial={{ opacity: 0, x: 220 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
            className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-5xl"
          >
            <span className="relative inline-block">
              <span className="text-shimmer">Everyone earns as it spins.</span>
              <span aria-hidden className="text-glint absolute inset-0">
                Everyone earns as it spins.
              </span>
            </span>
          </motion.h2>
        </Float>
      </div>

      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
        {/* the wheel */}
        <div className="relative mx-auto h-[250px] w-[250px] sm:h-[380px] sm:w-[380px]">
          {/* rotating dashed ring, speeds up at the finale */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: fast ? 7 : 18, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-6 rounded-full border-2 border-dashed border-azure/30"
          />
          {/* radar sweep riding the ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: fast ? 2.4 : 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-6 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 72%, rgba(46,155,255,0.35) 88%, transparent 100%)',
              filter: 'blur(6px)',
            }}
          />
          {/* pulse flash on every beat */}
          {beat > 0 && (
            <motion.span
              key={`wheelflash-${beat}`}
              initial={{ opacity: 0.45, scale: 0.6 }}
              animate={{ opacity: 0, scale: 1.35 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-4 rounded-full bg-azure/15"
            />
          )}
          <div className="absolute inset-6 rounded-full shadow-[inset_0_0_60px_rgba(46,155,255,0.12)]" />

          {/* orbiting XRP pulses */}
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
            {orbitDots.map((delay, i) => (
              <circle key={`${fast ? 'f' : 's'}-${i}`} r="5" fill="#2E9BFF">
                <animateMotion
                  dur={orbitDur}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                  path="M200,44 a156,156 0 1,1 -0.1,0 z"
                />
              </circle>
            ))}
          </svg>

          {/* center medallion */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <motion.div
              animate={{ scale: fast ? [1, 1.08, 1] : [1, 1.03, 1] }}
              transition={{ duration: fast ? 1.2 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white ring-1 ring-azure/50 shadow-[0_0_50px_-8px_rgba(46,155,255,0.8)] sm:h-24 sm:w-24"
              style={{
                background:
                  'radial-gradient(120% 120% at 50% 0%, rgba(46,155,255,0.65) 0%, rgba(16,42,92,0.95) 60%, #0A1128 100%)',
              }}
            >
              <XrpMark className="h-10 w-10" strokeWidth={4.5} />
            </motion.div>
            <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.3em] text-azure-bright">
              {fast ? 'Accelerating' : 'The Flywheel'}
            </span>
          </div>

          {/* nodes pop in with the beats */}
          {WHEEL_NODES.map((n, i) => (
            <motion.div
              key={n.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={beat > i ? { opacity: 1, scale: [0, 1.25, 1] } : {}}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute ${NODE_POS[n.pos]}`}
            >
              <Float amt={4} dur={3 + i * 0.4}>
                <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-[#141828]/95 px-4 py-2.5 ring-1 ring-white/[0.14] shadow-[0_10px_26px_rgba(0,0,0,0.5)] backdrop-blur">
                  <span className="text-[17px]">{n.emoji}</span>
                  <span className="font-display text-[13px] font-semibold text-white">
                    {n.label}
                  </span>
                </span>
              </Float>
            </motion.div>
          ))}
        </div>

        {/* the story beats */}
        <div className="space-y-3.5 sm:space-y-5">
          {WHEEL_BEATS.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 60 }}
              animate={beat > i ? { opacity: 1, x: 0 } : {}}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="flex items-start gap-3 text-left sm:gap-4"
            >
              <span
                className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full font-display text-[13px] font-bold sm:h-8 sm:w-8 sm:text-[14px] ${
                  i === 3 ? 'bg-azure text-white' : 'bg-white/[0.08] text-azure-bright ring-1 ring-white/[0.12]'
                }`}
              >
                {i + 1}
              </span>
              <p
                className={`text-[13.5px] leading-snug sm:text-[17px] sm:leading-relaxed ${
                  i === 3 ? 'font-display font-semibold text-white' : 'text-white/75'
                }`}
              >
                {line}
              </p>
            </motion.div>
          ))}

          {/* finale: launch blitz */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={beat >= 5 ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            className={`${glass} p-6`}
          >
            <p className="font-display text-[17px] font-semibold text-white">
              Ignition: a launch blitz built to detonate the first weeks.
            </p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-white/60">
              Coordinated campaigns across TikTok, Instagram and X, feeding
              the wheel from day one, one of the most aggressive marketing
              engines any coin has launched with.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {[
                { name: 'TikTok', glyph: '♪', cls: 'bg-black text-white ring-white/20' },
                {
                  name: 'Instagram',
                  glyph: '◉',
                  cls: 'text-white ring-white/20',
                  style: {
                    background:
                      'linear-gradient(45deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)',
                  },
                },
                { name: 'X', glyph: '𝕏', cls: 'bg-black text-white ring-white/20' },
              ].map((s, i) => (
                <motion.span
                  key={s.name}
                  initial={{ opacity: 0, scale: 0, rotate: -12 }}
                  animate={beat >= 5 ? { opacity: 1, scale: [0, 1.2, 1], rotate: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 font-display text-[13px] font-semibold ring-1 ${s.cls}`}
                  style={s.style}
                >
                  <span>{s.glyph}</span>
                  {s.name}
                </motion.span>
              ))}
            </div>
            <p className="mt-4 font-display text-[15px] font-semibold text-azure-bright">
              Built to make history for XRP. Show us another coin built like
              this.
            </p>
            <p className="mt-2 text-[11px] text-mist-faint">
              A flywheel needs volume to spin. Momentum is the design goal,
              never a guarantee.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// compact how-it-works strip under the link card
function StepStrip() {
  const steps = [
    ['🔗', 'Share your link'],
    ['💎', 'Friends hold & earn'],
    ['💰', 'You earn 10% on top'],
  ]
  return (
    <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2.5">
      {steps.map(([e, t], i) => (
        <div key={t} className="flex items-center gap-2.5">
          {i > 0 && <span className="text-[15px] text-white/30">→</span>}
          <motion.span
            initial={{ opacity: 0, y: 18, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 240, damping: 20 }}
            className="flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2.5 ring-1 ring-white/[0.1] backdrop-blur"
          >
            <Float amt={3} dur={2.4 + i * 0.4}>
              <span className="text-[16px]">{e}</span>
            </Float>
            <span className="font-display text-[13px] font-semibold text-white">{t}</span>
          </motion.span>
        </div>
      ))}
    </div>
  )
}

// where the 10% comes from: animated fee split bar, mobile-game style
function FeeSplit() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      className={`${glass} mx-auto mt-14 max-w-3xl p-7 sm:p-9`}
    >
      <h3 className="font-display text-[20px] font-semibold text-white">
        Where the 10% comes from
      </h3>
      <p className="mt-1 text-[14px] text-white/55">
        Every trade pays a 5% fee. It splits two ways, and your bonus lives in
        the second slice:
      </p>
      <div className="mt-6 flex h-16 gap-1 overflow-hidden rounded-2xl ring-1 ring-white/[0.1]">
        <motion.div
          initial={{ width: '0%' }}
          whileInView={{ width: '80%' }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.9, ease: EASE }}
          className="flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap bg-gradient-to-r from-azure-deep/70 to-azure/60 px-3"
        >
          <XrpMark className="h-4 w-4 flex-none text-white" strokeWidth={5} />
          <span className="font-display text-[14px] font-semibold text-white sm:text-[15px]">
            4/5 · Airdropped to holders as XRP
          </span>
        </motion.div>
        <motion.div
          initial={{ width: '0%' }}
          whileInView={{ width: '20%' }}
          viewport={{ once: true }}
          transition={{ delay: 1.0, duration: 0.6, ease: EASE }}
          className="flex items-center justify-center overflow-hidden whitespace-nowrap bg-gradient-to-r from-[#1f8f4e]/70 to-[#30D158]/60 px-2"
        >
          <span className="font-display text-[13px] font-semibold text-white">1/5</span>
        </motion.div>
      </div>
      <div className="mt-4 flex justify-end">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: [0, 1.15, 1] }}
          viewport={{ once: true }}
          transition={{ delay: 1.7, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 rounded-full bg-[#30D158]/12 px-4 py-2 ring-1 ring-[#30D158]/30"
        >
          <span className="text-[16px]">🎁</span>
          <span className="font-display text-[13px] font-semibold text-[#30D158]">
            Marketing & referrals — your 10% bonus is paid from here
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// squad tiers, mobile-game style
const TIERS = [
  { min: 1, name: 'Recruit', emoji: '🥉' },
  { min: 5, name: 'Squad Leader', emoji: '🥈' },
  { min: 10, name: 'Whale Wrangler', emoji: '🥇' },
  { min: 20, name: 'XRP Kingpin', emoji: '👑' },
]

function RefCalculator() {
  const [friends, setFriends] = useState(5)
  const [avgPos, setAvgPos] = useState(10000)

  const friendsDailyXrp = (friends * avgPos * DAILY_RATE) / XRP_PRICE
  const yourDailyXrp = friendsDailyXrp * REF_CUT

  const tierIdx = TIERS.reduce((acc, t, i) => (friends >= t.min ? i : acc), 0)
  const tier = TIERS[tierIdx]
  const next = TIERS[tierIdx + 1]
  const progress = next ? (friends - tier.min) / (next.min - tier.min) : 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      className={`${glass} mx-auto mt-14 max-w-3xl p-7 sm:p-9`}
    >
      <h3 className="font-display text-[20px] font-semibold text-white">What your squad is worth</h3>
      <p className="mt-1 text-[14px] text-white/55">
        Simulated at $10M avg daily volume, $5M market cap. Arithmetic, not a promise.
      </p>

      {/* squad tier badge + progress to next rank */}
      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/[0.08]">
        <Float amt={4} dur={2.4}>
          <motion.span
            key={tier.name}
            initial={{ scale: 0.4, rotate: -20 }}
            animate={{ scale: [0.4, 1.25, 1], rotate: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="block text-4xl"
          >
            {tier.emoji}
          </motion.span>
        </Float>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-display text-[16px] font-semibold text-white">{tier.name}</span>
            {next ? (
              <span className="text-[12px] text-white/50">
                {next.min - friends} more to {next.emoji} {next.name}
              </span>
            ) : (
              <span className="text-[12px] font-semibold text-[#F5C542]">Max rank</span>
            )}
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              animate={{ width: `${Math.max(progress * 100, 6)}%` }}
              transition={{ type: 'spring', stiffness: 160, damping: 22 }}
              className="h-full rounded-full bg-gradient-to-r from-azure to-azure-bright shadow-[0_0_12px_rgba(46,155,255,0.6)]"
            />
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-8 sm:grid-cols-2">
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <label className="text-[13px] font-medium text-white/55">Friends referred</label>
            <span className="font-display text-[15px] font-semibold tabular-nums text-white">
              {friends}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            value={friends}
            onChange={(e) => setFriends(Number(e.target.value))}
            className="w-full accent-[#2E9BFF]"
          />
        </div>
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <label className="text-[13px] font-medium text-white/55">Their average position</label>
            <span className="font-display text-[15px] font-semibold tabular-nums text-white">
              {usd(avgPos)}
            </span>
          </div>
          <input
            type="range"
            min="500"
            max="100000"
            step="500"
            value={avgPos}
            onChange={(e) => setAvgPos(Number(e.target.value))}
            className="w-full accent-[#2E9BFF]"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/[0.05] p-5 ring-1 ring-white/[0.08]">
          <span className="block text-[13px] font-medium text-white/55">Your bonus, daily</span>
          <span className="mt-1 block font-display text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-azure-bright">
            +{num(yourDailyXrp, 1)} XRP
          </span>
          <span className="block text-[13px] tabular-nums text-white/45">
            ≈ {usd(yourDailyXrp * XRP_PRICE)} per day
          </span>
        </div>
        <div className="rounded-2xl bg-white/[0.05] p-5 ring-1 ring-white/[0.08]">
          <span className="block text-[13px] font-medium text-white/55">Your bonus, monthly</span>
          <span className="mt-1 block font-display text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-white">
            +{num(yourDailyXrp * 30, 0)} XRP
          </span>
          <span className="block text-[13px] tabular-nums text-white/45">
            ≈ {usd(yourDailyXrp * 30 * XRP_PRICE)} per month
          </span>
        </div>
      </div>
    </motion.div>
  )
}

const SAMPLE_REFS = [
  { tag: '7xKX…gAsU', ago: 'Just now', xrp: 2.84 },
  { tag: '9mPa…c2Wd', ago: '1h ago', xrp: 1.92 },
  { tag: '4hQz…nR8k', ago: '1h ago', xrp: 4.31 },
  { tag: 'Bv3s…tY6e', ago: '2h ago', xrp: 0.87 },
  { tag: '2kLm…pX4j', ago: '3h ago', xrp: 3.15 },
]

function RefDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      className="mx-auto mt-14 max-w-3xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-[20px] font-semibold text-white">Your referral account</h3>
        <span className="rounded-full border border-brass/40 bg-brass/[0.06] px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
          Sample preview · Live at launch
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ['Friends referred', '7', 'holding right now'],
          ['They earned', '12,480 XRP', '≈ ' + usd(12480 * XRP_PRICE)],
          ['Your 10%', '1,248 XRP', '≈ ' + usd(1248 * XRP_PRICE)],
        ].map(([label, value, sub]) => (
          <div key={label} className={`${glass} p-5`}>
            <span className="block text-[13px] font-medium text-white/55">{label}</span>
            <span className="mt-1 block font-display text-[24px] font-semibold tabular-nums tracking-[-0.02em] text-white">
              {value}
            </span>
            <span className="block text-[13px] tabular-nums text-white/45">{sub}</span>
          </div>
        ))}
      </div>

      <div className={`${glass} mt-4 overflow-hidden`}>
        <div className="flex items-center justify-between px-6 pb-2 pt-5">
          <span className="font-display text-[15px] font-semibold text-white">Referral bonuses</span>
          <span className="text-[13px] font-medium text-azure-bright">Hourly · Automatic</span>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {SAMPLE_REFS.map((r) => (
            <div key={r.tag} className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-white/[0.03]">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/[0.08] ring-1 ring-white/[0.12]">
                <XrpMark className="h-[16px] w-[16px] text-azure" strokeWidth={5} />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold text-white">Friend {r.tag}</span>
                <span className="block text-[12.5px] text-white/45">Earned their payout · {r.ago}</span>
              </div>
              <span className="font-display text-[15px] font-semibold tabular-nums text-[#30D158]">
                +{num(r.xrp, 2)} XRP to you
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-mist-faint">
        One level only: you earn on people you directly refer, never on chains
        beneath them. Bonuses are paid from the 1/5 marketing &amp; referral
        fee allocation, never deducted from your friends&rsquo; payouts and
        never from anyone&rsquo;s principal. Figures shown are illustrative
        and vary with trading volume.
      </p>
    </motion.div>
  )
}

/* ---------------------------------- page ----------------------------------- */

const ACT_DURATIONS = [3400, 18200, 14600, 10400]

export default function ReferralPage() {
  const [act, setAct] = useState(0)
  const lastSkipRef = useRef(0)

  useEffect(() => {
    if (act >= 4) return
    const t = setTimeout(() => setAct(act + 1), ACT_DURATIONS[act])
    return () => clearTimeout(t)
  }, [act])

  // tap anywhere to skip ahead, with a 0.4s breather between skips
  const skip = () => {
    const now = performance.now()
    if (now - lastSkipRef.current < 400) return
    lastSkipRef.current = now
    setAct((a) => Math.min(a + 1, 4))
  }

  return (
    <div className="relative overflow-x-clip pt-16">
      <div className="pointer-events-none absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-azure-deep/[0.16] blur-[140px]" />

      {act < 4 ? (
        <div
          onClick={skip}
          className="relative flex min-h-[calc(100vh-4rem)] cursor-pointer select-none items-center justify-center px-6 py-12"
        >
          <AnimatePresence mode="wait">
            {act === 0 && <ActTitle key="ref-title" />}
            {act === 1 && <ActPhones key="ref-phones" />}
            {act === 2 && <ActVirus key="ref-virus" />}
            {act === 3 && <ActMomentum key="ref-momentum" />}
          </AnimatePresence>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.25, 0.5] }}
            transition={{ delay: 2, duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-mist-faint"
          >
            tap to skip ›
          </motion.span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-6xl px-6 pb-24 pt-14 sm:pt-20"
        >
          <div className="mb-10 text-center">
            <motion.p
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [0, 1.15, 1] }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow mb-6"
            >
              Your turn
            </motion.p>
            <Float amt={6} dur={5.5}>
              <motion.h1
                initial={{ opacity: 0, x: -220 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="font-display text-5xl font-semibold tracking-[-0.03em] sm:text-7xl"
              >
                Get started
              </motion.h1>
            </Float>
            <Float delay={0.4} amt={7} dur={5}>
              <motion.h1
                initial={{ opacity: 0, x: 220 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12, duration: 0.5, ease: EASE }}
                className="font-display text-5xl font-semibold tracking-[-0.03em] sm:text-7xl"
              >
                <span className="relative inline-block">
                  <span className="text-shimmer">referring.</span>
                  <span aria-hidden className="text-glint absolute inset-0">
                    referring.
                  </span>
                </span>
              </motion.h1>
            </Float>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
              className="mx-auto mt-5 max-w-xl text-lg text-mist-dim"
            >
              10 seconds to grab your link. A lifetime of 10% on everything
              your friends earn.
            </motion.p>
          </div>

          <LinkCard />
          <StepStrip />
          <RefCalculator />
          <FeeSplit />
          <RefDashboard />
        </motion.div>
      )}
    </div>
  )
}
