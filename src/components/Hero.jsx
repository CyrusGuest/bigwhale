import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// XRP-style mark: two thick wishbone halves forming the X, arms at ~45°,
// deep rounded junctions and round caps, nearly touching at the center
export function XrpMark({ className = '', strokeWidth = 5 }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path
        d="M4.5 4.5 L12.2 11.8 Q16 15.4 19.8 11.8 L27.5 4.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M4.5 27.5 L12.2 20.2 Q16 16.6 19.8 20.2 L27.5 27.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}

const XRP_PRICE = 1.34
const EASE = [0.22, 1, 0.36, 1]

/* ------------------------------ notifications ------------------------------ */

const OTHER_NOTIFS = [
  {
    app: 'X',
    icon: 'x',
    body: '@XPYOFFICIAL: We just purchased $1,000,000 worth of XRP for our Reserve to support the XRP ecosystem…',
    hl: '$1,000,000 worth of XRP',
  },
  {
    app: 'Stocks',
    icon: 'stocks',
    body: 'BTC $118,240 (+2.4%) · SOL $236 (+3.1%) · XRP $1.34 (+5.2%)',
  },
  {
    app: 'X',
    icon: 'x',
    body: '@XRP589: 1 XPY = 1 XRP. i said what i said.',
    hl: '1 XPY = 1 XRP',
  },
  {
    app: 'News',
    icon: 'news',
    body: 'BREAKING: degens can’t stop tweeting “1 XPY = 1 XRP”',
    hl: '“1 XPY = 1 XRP”',
  },
  {
    app: 'X',
    icon: 'x',
    body: '@SolWhaleCap: a $1M XRP reserve behind an hourly-payout coin is the most bullish thing in the XRP ecosystem rn',
    hl: '$1M XRP reserve',
  },
]

// hand-drawn app icons in the style of the real apps
function AppIcon({ kind }) {
  if (kind === 'stocks')
    return (
      <svg viewBox="0 0 38 38" className="h-full w-full">
        <rect width="38" height="38" fill="#1C1C1E" />
        <polyline
          points="6,27 13,19 18,23 31,9"
          fill="none"
          stroke="#30D158"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="24,9 31,9 31,16"
          fill="none"
          stroke="#30D158"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  if (kind === 'x')
    return (
      <svg viewBox="0 0 38 38" className="h-full w-full">
        <rect width="38" height="38" fill="#000000" />
        <path
          d="M8.5 8.5h6.2l6 7.6 5.8-7.6h5l-8.3 10.2L32 29.5h-6.2l-6.5-8.2-6.3 8.2H8l8.8-10.9L8.5 8.5z"
          fill="#FFFFFF"
        />
      </svg>
    )
  if (kind === 'news')
    return (
      <svg viewBox="0 0 38 38" className="h-full w-full">
        <rect width="38" height="38" fill="#F5F5F7" />
        <defs>
          <linearGradient id="newsN" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF6482" />
            <stop offset="100%" stopColor="#FF3B30" />
          </linearGradient>
        </defs>
        <path d="M10 29V9h4.6l8.8 13.4V9H28v20h-4.6L14.6 15.6V29H10z" fill="url(#newsN)" />
      </svg>
    )
  return null
}

let notifCounter = 0
function makeNotif() {
  const n = ++notifCounter
  if (n % 2 === 1) {
    const usd = 40 + Math.random() * 70
    return { id: n, type: 'pay', amt: usd / XRP_PRICE, usd }
  }
  return { id: n, type: 'app', ...OTHER_NOTIFS[(n / 2 - 1) % OTHER_NOTIFS.length] }
}

/* --------------------------------- phone ---------------------------------- */

function PhoneMock({ notifs }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{ y: [0, -9, 0], rotate: [0, 0.6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-[310px]"
      >
        {/* titanium frame */}
        <div className="relative rounded-[3.2rem] bg-gradient-to-b from-[#55607a] via-[#2a3147] to-[#171c2e] p-[3px] shadow-[0_44px_110px_-24px_rgba(0,0,0,0.9),0_0_90px_-28px_rgba(46,155,255,0.45)]">
          {/* side buttons */}
          <div className="absolute -left-[2.5px] top-[104px] h-7 w-[3px] rounded-l-full bg-gradient-to-b from-[#5b6680] to-[#2a3147]" />
          <div className="absolute -left-[2.5px] top-[144px] h-12 w-[3px] rounded-l-full bg-gradient-to-b from-[#5b6680] to-[#2a3147]" />
          <div className="absolute -left-[2.5px] top-[204px] h-12 w-[3px] rounded-l-full bg-gradient-to-b from-[#5b6680] to-[#2a3147]" />
          <div className="absolute -right-[2.5px] top-[160px] h-[70px] w-[3px] rounded-r-full bg-gradient-to-b from-[#5b6680] to-[#2a3147]" />

          {/* black bezel */}
          <div className="rounded-[3.05rem] bg-black p-[9px]">
            {/* screen */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#070B1A]">
              {/* wallpaper glow */}
              <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-azure-deep/40 blur-[70px]" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-azure/10 blur-[60px]" />
              {/* glass glare */}
              <div className="pointer-events-none absolute -left-24 -top-10 h-[130%] w-36 rotate-12 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
              {/* screen wake flash on new payout */}
              <motion.div
                key={`flash-${notifs[0]?.id}`}
                initial={{ opacity: 0.1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="pointer-events-none absolute inset-0 z-10 bg-white"
              />

              {/* status bar */}
              <div className="relative flex items-center justify-end gap-1.5 px-6 pt-4 text-white/60">
                <svg viewBox="0 0 18 12" className="h-[10px] w-[15px] fill-current">
                  <rect x="0" y="8" width="3" height="4" rx="0.8" />
                  <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" />
                  <rect x="9" y="3" width="3" height="9" rx="0.8" />
                  <rect x="13.5" y="0.5" width="3" height="11.5" rx="0.8" opacity="0.4" />
                </svg>
                <svg viewBox="0 0 16 12" className="h-[10px] w-[13px] fill-current">
                  <path d="M8 9.7a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2ZM8 5.6c1.8 0 3.4.7 4.6 1.9l-1.5 1.5A4.4 4.4 0 0 0 8 7.8c-1.2 0-2.3.5-3.1 1.2L3.4 7.5A6.5 6.5 0 0 1 8 5.6ZM8 1.5c2.9 0 5.5 1.2 7.4 3l-1.5 1.5A8.4 8.4 0 0 0 8 3.6c-2.3 0-4.4.9-5.9 2.4L.6 4.5c1.9-1.8 4.5-3 7.4-3Z" />
                </svg>
                <span className="ml-0.5 flex h-[11px] w-[22px] items-center rounded-[3px] border border-white/40 px-[2px]">
                  <span className="h-[6px] w-[70%] rounded-[1px] bg-white/80" />
                </span>
              </div>

              {/* dynamic island */}
              <div className="absolute left-1/2 top-3.5 z-20 flex h-[27px] w-[102px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#10151f] ring-1 ring-white/[0.06]" />
              </div>

              <div className="relative px-3.5 pb-5 pt-7">
                {/* lock screen clock */}
                <div className="text-center">
                  <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1 text-[10px] font-medium text-white/60 backdrop-blur">
                    <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 fill-current">
                      <path d="M13.5 9.8A6 6 0 0 1 6.2 2.5a6 6 0 1 0 7.3 7.3Z" />
                    </svg>
                    Do Not Disturb
                  </div>
                  <div className="mt-2 text-[15px] font-medium text-white/70">Tuesday, 5:89 PM</div>
                  <div className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-[68px] font-semibold leading-[1.05] tracking-tight text-transparent">
                    5:89
                  </div>
                </div>

                {/* notifications: fixed-height stage so the phone never resizes */}
                <div className="relative mt-4 h-[280px] overflow-hidden">
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-[#070B1A] to-transparent" />
                  <div className="flex flex-col gap-2">
                    <AnimatePresence initial={false} mode="popLayout">
                      {notifs.map((n, i) => (
                        <motion.div
                          key={n.id}
                          layout
                          initial={{ opacity: 0, y: -28, scale: 0.94 }}
                          animate={{ opacity: 1 - i * 0.14, y: 0, scale: 1 - i * 0.02 }}
                          exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
                          transition={{ type: 'spring', stiffness: 240, damping: 26, mass: 0.9 }}
                          className="rounded-[20px] border border-white/[0.07] bg-[#2a3040]/60 p-3 shadow-lg shadow-black/25 backdrop-blur-2xl"
                        >
                          <div className="flex items-center gap-3">
                            {n.type === 'pay' ? (
                              <span
                                className="relative flex h-[38px] w-[38px] flex-none items-center justify-center overflow-hidden rounded-[9.5px] shadow-md shadow-azure/30 ring-1 ring-white/10"
                                style={{
                                  background:
                                    'radial-gradient(130% 105% at 50% 0%, rgba(46,155,255,0.55) 0%, rgba(16,40,88,0.95) 48%, #05080F 100%)',
                                }}
                              >
                                <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.18] to-transparent" />
                                <XrpMark className="relative h-[21px] w-[21px] text-white" strokeWidth={5.2} />
                              </span>
                            ) : (
                              <span className="h-[38px] w-[38px] flex-none overflow-hidden rounded-[9.5px] shadow-md shadow-black/30">
                                <AppIcon kind={n.icon} />
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="text-[13px] font-semibold leading-tight text-white">
                                  {n.type === 'pay' ? 'XPY' : n.app}
                                </span>
                                <span className="text-[11px] text-white/40">
                                  {i === 0 ? 'now' : `${i}h ago`}
                                </span>
                              </div>
                              {n.type === 'pay' ? (
                                <p className="mt-[1px] text-[12.5px] leading-[1.35] text-white/75">
                                  You just got paid{' '}
                                  <span className="font-semibold text-[#8AC5FF]">
                                    +{n.amt.toFixed(2)} XRP
                                  </span>{' '}
                                  <span className="text-white/40">(≈ ${n.usd.toFixed(2)})</span>
                                </p>
                              ) : (
                                <p className="mt-[1px] text-[12.5px] leading-[1.35] text-white/75">
                                  {n.hl ? (
                                    <>
                                      {n.body.split(n.hl)[0]}
                                      <span className="font-semibold text-[#8AC5FF]">{n.hl}</span>
                                      {n.body.split(n.hl)[1]}
                                    </>
                                  ) : (
                                    n.body
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* flashlight + camera */}
                <div className="mt-4 flex items-center justify-between px-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.1] text-white/80 backdrop-blur">
                    <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
                      <path d="M5 1h6v2.5L9.5 6v7.5a1.5 1.5 0 0 1-3 0V6L5 3.5V1Zm3 7a.8.8 0 0 1 .8.8v3.4a.8.8 0 0 1-1.6 0V8.8A.8.8 0 0 1 8 8Z" />
                    </svg>
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.1] text-white/80 backdrop-blur">
                    <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
                      <path d="M5.5 2.5 6.6 1h2.8l1.1 1.5H13A1.5 1.5 0 0 1 14.5 4v8A1.5 1.5 0 0 1 13 13.5H3A1.5 1.5 0 0 1 1.5 12V4A1.5 1.5 0 0 1 3 2.5h2.5ZM8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 1.5A1.5 1.5 0 1 1 8 9.5 1.5 1.5 0 0 1 8 6.5Z" />
                    </svg>
                  </span>
                </div>

                {/* home indicator */}
                <div className="mx-auto mt-3 h-[4px] w-28 rounded-full bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <p className="relative mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-mist-faint">
        Simulated preview · Payouts land hourly, even at 5:89
      </p>
    </div>
  )
}

/* ------------------------------ opening acts ------------------------------- */

const actExit = { opacity: 0, y: -46, scale: 0.97, transition: { duration: 0.35, ease: EASE } }

// gentle perpetual float so text never sits still
function Float({ children, delay = 0, amt = 8, dur = 5, className = '' }) {
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

// Act 1: kinetic slam — words collide from opposite edges with XRP-mark bursts
const BURST = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2
  return {
    x: Math.cos(a) * (110 + (i % 3) * 40),
    y: Math.sin(a) * (80 + (i % 2) * 30),
    r: 120 + i * 36,
    s: 0.7 + (i % 3) * 0.3,
  }
})

function Burst({ delay }) {
  return (
    <span className="pointer-events-none absolute left-1/2 top-1/2">
      {BURST.map((b, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.3, rotate: 0 }}
          animate={{ opacity: [0, 1, 0], x: b.x, y: b.y, scale: b.s, rotate: b.r }}
          transition={{ delay, duration: 0.75, ease: 'easeOut' }}
          className="absolute text-azure"
        >
          <XrpMark className="h-5 w-5" strokeWidth={4} />
        </motion.span>
      ))}
    </span>
  )
}

function ImpactPulse({ delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.7, 0], scale: [0.3, 1.4, 1.8] }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-[min(88vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-azure/25 blur-3xl"
    />
  )
}

function ActTitle() {
  return (
    <motion.div exit={actExit} className="relative w-full px-4 text-center">
      <Float amt={8} dur={5} delay={1.8}>
        {/* line 1: BUY + XPY. slam in from opposite sides and collide */}
        <div className="relative flex flex-wrap items-center justify-center gap-x-5">
          <ImpactPulse delay={0.55} />
          <Burst delay={0.55} />
          <motion.span
            initial={{ x: '-70vw', rotate: -14, opacity: 0 }}
            animate={{ x: 0, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.12, type: 'spring', stiffness: 230, damping: 16 }}
            className="text-3d inline-block text-6xl font-bold tracking-[-0.03em] sm:text-8xl lg:text-9xl"
          >
            BUY
          </motion.span>
          <motion.span
            initial={{ x: '70vw', rotate: 14, opacity: 0 }}
            animate={{ x: 0, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.26, type: 'spring', stiffness: 230, damping: 16 }}
            className="text-3d inline-block text-6xl font-bold tracking-[-0.03em] sm:text-8xl lg:text-9xl"
          >
            XPY.
          </motion.span>
        </div>

        {/* line 2: drops from above and bounces on landing */}
        <div className="relative">
          <ImpactPulse delay={1.25} />
          <Burst delay={1.25} />
          <motion.h1
            initial={{ y: '-58vh', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 210, damping: 13 }}
            className="text-3d origin-bottom text-6xl font-bold leading-[1.1] tracking-[-0.03em] sm:text-8xl lg:text-9xl"
          >
            EARN <span className="text-shimmer">XRP</span>.
          </motion.h1>
        </div>

        {/* tagline words pop like impacts */}
        <div className="mt-7 flex items-center justify-center gap-3 font-mono text-sm uppercase tracking-[0.3em] text-azure-bright sm:text-base">
          {['Passively', '·', 'Hourly'].map((w, i) => (
            <motion.span
              key={w + i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [0, 1.25, 1] }}
              transition={{ delay: 1.75 + i * 0.14, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              {w}
            </motion.span>
          ))}
        </div>
      </Float>
    </motion.div>
  )
}
// Act 2: the phone, early, with floating copy beside it
function ActPhone({ notifs }) {
  return (
    <motion.div
      exit={{ opacity: 0, x: -320, transition: { duration: 0.4, ease: EASE } }}
      className="grid w-full items-center gap-10 lg:grid-cols-2"
    >
      <motion.div
        initial={{ opacity: 0, x: -90 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
        className="text-center lg:text-left"
      >
        <Float amt={9} dur={5}>
          <h2 className="text-5xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-7xl">
            Get paid
            <br />
            <span className="text-shimmer">while you sleep.</span>
          </h2>
        </Float>
        <Float delay={0.5} amt={6} dur={6}>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-7 flex flex-wrap justify-center gap-x-2 font-mono text-sm uppercase tracking-[0.3em] text-azure-bright lg:justify-start"
          >
            {['Real', 'XRP', '·', 'Straight', 'to', 'your', 'wallet'].map((w, i) => (
              <motion.span
                key={i}
                animate={{
                  scale: [1, w === '·' ? 1 : w === 'Real' || w === 'XRP' ? 1.38 : 1.22, 1],
                  color: ['#66B8FF', '#FFFFFF', '#66B8FF'],
                }}
                transition={{
                  delay: 1.5 + i * 0.14,
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1.55,
                  ease: 'easeInOut',
                }}
                className="inline-block origin-center"
              >
                {w}
              </motion.span>
            ))}
          </motion.p>
        </Float>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 520, rotate: 10 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative flex origin-top scale-[0.88] justify-center sm:scale-95"
      >
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-azure-deep/[0.28] blur-[100px]" />
        <PhoneMock notifs={notifs} />
      </motion.div>
    </motion.div>
  )
}

// Act 3: earning in your sleep — payout cards fly in from the screen edges
const SLEEP_DROPS = [
  { t: '3:47 AM', amt: 32.84 },
  { t: '4:47 AM', amt: 29.1 },
  { t: '5:47 AM', amt: 35.62 },
]

function ActSleep() {
  return (
    <motion.div exit={actExit} className="w-full px-4">
      <div className="mx-auto max-w-2xl text-center">
        <Float amt={7} dur={5}>
          <motion.h2
            initial={{ opacity: 0, x: -260 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="text-5xl font-bold tracking-[-0.03em] sm:text-7xl"
          >
            You slept.
          </motion.h2>
        </Float>
        <Float delay={0.4} amt={7} dur={5.4}>
          <motion.h2
            initial={{ opacity: 0, x: 260 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.55, ease: EASE }}
            className="text-5xl font-bold tracking-[-0.03em] sm:text-7xl"
          >
            You{' '}
            <span className="relative inline-block">
              <span className="text-shimmer">earned.</span>
              <span aria-hidden className="text-glint absolute inset-0">
                earned.
              </span>
            </span>
          </motion.h2>
        </Float>

        <div className="mt-9 space-y-3">
          {SLEEP_DROPS.map((d, i) => (
            <motion.div
              key={d.t}
              initial={{ opacity: 0, x: i % 2 ? 360 : -360, rotate: i % 2 ? 5 : -5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.7 + i * 0.32, type: 'spring', stiffness: 200, damping: 22 }}
              className="mx-auto flex w-full max-w-md items-center gap-3 rounded-[20px] border border-white/[0.07] bg-[#2a3040]/60 p-3.5 text-left shadow-lg shadow-black/25 backdrop-blur-2xl"
            >
              <span
                className="relative flex h-[38px] w-[38px] flex-none items-center justify-center overflow-hidden rounded-[9.5px] shadow-md shadow-azure/30 ring-1 ring-white/10"
                style={{
                  background:
                    'radial-gradient(130% 105% at 50% 0%, rgba(46,155,255,0.55) 0%, rgba(16,40,88,0.95) 48%, #05080F 100%)',
                }}
              >
                <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.18] to-transparent" />
                <XrpMark className="relative h-[21px] w-[21px] text-white" strokeWidth={5.2} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-semibold text-white">XPY</span>
                  <span className="text-[11px] text-white/40">{d.t}</span>
                </div>
                <p className="mt-[1px] text-[13px] text-white/75">
                  You just got paid{' '}
                  <span className="font-semibold text-[#8AC5FF]">+{d.amt.toFixed(2)} XRP</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <Float delay={1.1} amt={5} dur={5}>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.5 }}
            className="mt-8 font-mono text-sm uppercase tracking-[0.26em] text-azure-bright"
          >
            +97.56 XRP while you dreamt
          </motion.p>
        </Float>
      </div>
    </motion.div>
  )
}

// simple mount-triggered count-up for act numbers
function RollUp({ target, prefix = '', dur = 1.6, delay = 0 }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now() + delay * 1000
    const tick = (now) => {
      const t = Math.min(Math.max((now - start) / (dur * 1000), 0), 1)
      setV(target * (1 - Math.pow(1 - t, 4)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, dur, delay])
  return (
    <>
      {prefix}
      {Math.round(v).toLocaleString('en-US')}
    </>
  )
}

// Act 4: the million-dollar reserve, rolling up
function ActReserve() {
  return (
    <motion.div exit={actExit} className="w-full px-4 text-center">
      <Float amt={5} dur={5.5}>
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.34em' }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
          className="font-mono text-sm uppercase text-azure-bright"
        >
          Standing behind XPY
        </motion.p>
      </Float>
      <Float delay={0.3} amt={9} dur={4.8}>
        <motion.h2
          initial={{ opacity: 0, scale: 1.3, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.35, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-6xl font-bold tabular-nums tracking-[-0.03em] text-mist [text-shadow:0_0_60px_rgba(46,155,255,0.45)] sm:text-8xl"
        >
          <RollUp target={1000000} prefix="$" dur={1.8} delay={0.5} />
        </motion.h2>
      </Float>
      <Float delay={0.6} amt={6} dur={5.2}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5, ease: EASE }}
          className="mt-5 text-2xl font-medium text-mist sm:text-3xl"
        >
          of <span className="text-shimmer">XRP</span> in our starting reserve
        </motion.p>
      </Float>
      <Float delay={0.9} amt={4} dur={6}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-mist-faint"
        >
          Held on the public ledger · Verify any time · Attestation publishes at launch
        </motion.p>
      </Float>
    </motion.div>
  )
}

// Act 5: your earnings curve draws itself live, payouts popping along the way
const PORTAL_PTS = [0, 5, 8, 14, 17, 24, 28, 35, 39, 47, 54, 62]
const PORTAL_POPS = [
  { i: 4, label: '+8,412 XRP' },
  { i: 8, label: '+12,930 XRP' },
  { i: 11, label: '+38,346 XRP' },
]

function ActPortal() {
  const W = 460
  const H = 170
  const max = PORTAL_PTS[PORTAL_PTS.length - 1]
  const px = (i) => 14 + ((W - 28) / (PORTAL_PTS.length - 1)) * i
  const py = (v) => H - 14 - (v / max) * (H - 40)
  const line = PORTAL_PTS.map((v, i) => `${i ? 'L' : 'M'}${px(i)},${py(v)}`).join(' ')
  const drawStart = 1.1
  const drawDur = 1.7
  const popDelay = (i) => drawStart + (i / (PORTAL_PTS.length - 1)) * drawDur

  return (
    <motion.div exit={actExit} className="w-full px-4 text-center">
      <Float amt={7} dur={5}>
        <motion.h2
          initial={{ opacity: 0, x: -240 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="text-4xl font-bold tracking-[-0.03em] sm:text-6xl"
        >
          Watch it{' '}
          <span className="relative inline-block">
            <span className="text-shimmer">stack up.</span>
            <span aria-hidden className="text-glint absolute inset-0">
              stack up.
            </span>
          </span>
        </motion.h2>
      </Float>
      <Float delay={0.3} amt={5} dur={5.6}>
        <motion.p
          initial={{ opacity: 0, x: 240 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.55, ease: EASE }}
          className="mt-4 text-lg text-mist-dim sm:text-xl"
        >
          Every payout tracked, daily, in your Holder Portal.
        </motion.p>
      </Float>

      <Float delay={0.6} amt={6} dur={5.2}>
        <motion.div
          initial={{ opacity: 0, y: 90, scale: 0.93, rotate: -1.5 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 170, damping: 20 }}
          className="mx-auto mt-8 w-full max-w-xl rounded-lg border border-white/[0.08] bg-ink-900/85 p-6 text-left shadow-2xl shadow-black/50 backdrop-blur"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-mist-faint">
                XRP earned, all time
              </span>
              <span className="mt-1 block font-mono text-3xl font-semibold tabular-nums text-mist sm:text-4xl">
                <RollUp target={38346} dur={1.9} delay={1.1} />
                <span className="ml-2 text-lg text-azure">XRP</span>
              </span>
              <span className="mt-0.5 block font-mono text-sm tabular-nums text-azure-bright">
                ≈ <RollUp target={51384} prefix="$" dur={1.9} delay={1.2} />
              </span>
            </div>
            <div className="pb-1 text-right">
              <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-mist-faint">
                Next payout
              </span>
              <span className="mt-1 block font-mono text-lg tabular-nums text-mist">41:32</span>
            </div>
          </div>

          <div className="relative mt-4">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
              <defs>
                <linearGradient id="actPortalArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E9BFF" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#2E9BFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d={`${line} L${px(PORTAL_PTS.length - 1)},${H - 14} L14,${H - 14} Z`}
                fill="url(#actPortalArea)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: drawStart + drawDur - 0.3, duration: 0.6 }}
              />
              <motion.path
                d={line}
                fill="none"
                stroke="#2E9BFF"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: drawStart, duration: drawDur, ease: 'linear' }}
              />
              {PORTAL_POPS.map(({ i }) => (
                <motion.circle
                  key={i}
                  cx={px(i)}
                  cy={py(PORTAL_PTS[i])}
                  r="5"
                  fill="#66B8FF"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [0, 1.6, 1] }}
                  transition={{ delay: popDelay(i), duration: 0.4 }}
                />
              ))}
            </svg>
            {/* payout chips popping along the curve as the line passes */}
            {PORTAL_POPS.map(({ i, label }) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 12, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: [0.6, 1.15, 1] }}
                transition={{ delay: popDelay(i) + 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full border border-azure/40 bg-ink-900/95 px-3 py-1 font-mono text-[11px] font-medium text-azure-bright shadow-lg shadow-azure/20"
                style={{
                  left: `${(px(i) / W) * 100}%`,
                  top: `${(py(PORTAL_PTS[i]) / H) * 100 - 6}%`,
                }}
              >
                {label}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </Float>

      <Float delay={1} amt={5} dur={5.4}>
        <motion.a
          href="#/portal"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [0, 1.15, 1] }}
          transition={{ delay: 3.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-azure/30 bg-azure/[0.08] px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-azure-bright transition-colors hover:bg-azure/[0.15]"
        >
          Open your Holder Portal →
        </motion.a>
      </Float>
    </motion.div>
  )
}

// Act 6: making history, then availability pops in beneath it
function ActStory() {
  const [showWallets, setShowWallets] = useState(false)
  const [wi, setWi] = useState(0)
  useEffect(() => {
    const t0 = setTimeout(() => setShowWallets(true), 4200)
    const t1 = setTimeout(() => setWi(1), 5800)
    const t2 = setTimeout(() => setWi(2), 7300)
    return () => {
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])
  return (
    <motion.div exit={actExit} className="w-full px-4 text-center">
      <motion.div layout transition={{ layout: { duration: 0.55, ease: EASE } }}>
      <Float amt={5} dur={5.5}>
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.42em' }}
          transition={{ delay: 0.05, duration: 0.7, ease: EASE }}
          className="font-mono text-xs uppercase text-azure-bright"
        >
          XPY is the first
        </motion.p>
      </Float>
      <Float delay={0.3} amt={8} dur={4.8}>
        <motion.h2
          initial={{ opacity: 0, scale: 1.25, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-luster mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-[-0.02em] sm:text-6xl"
        >
          Virtual XRP Algorithm Miner
        </motion.h2>
      </Float>
      <div className="mx-auto mt-7 max-w-xl space-y-3">
        {[
          'No rigs. No power bills. No staking.',
          'Every trade pays a fee. Every hour, holders get XRP.',
        ].map((line, i) => (
          <Float key={line} delay={0.6 + i * 0.4} amt={5} dur={5.8}>
            <motion.p
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.85 + i * 0.35, duration: 0.45, ease: EASE }}
              className="text-lg text-mist-dim sm:text-xl"
            >
              {line}
            </motion.p>
          </Float>
        ))}
      </div>
      <div className="relative mt-7 flex h-[72px] items-center justify-center sm:h-[84px]">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.55, 0], scale: [0.5, 1.5, 1.9] }}
          transition={{ delay: 2.15, duration: 0.8, ease: 'easeOut' }}
          className="pointer-events-none absolute h-20 w-80 rounded-full bg-azure/30 blur-2xl"
        />
        <Float delay={1.2} amt={6} dur={5}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.35 }}
            className="text-2xl font-medium text-mist sm:text-3xl"
          >
            This is how we make{' '}
            <motion.span
              data-text="HISTORY"
              initial={{ opacity: 0, scale: 1.4, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 2.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="glitch text-luster inline-block text-3xl font-bold sm:text-4xl"
            >
              HISTORY
            </motion.span>
            .
          </motion.span>
        </Float>
      </div>
      </motion.div>

      {/* availability pops in beneath; the history text stays and glides up */}
      <AnimatePresence>
        {showWallets && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mt-8"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.35em' }}
              transition={{ duration: 0.7, ease: EASE }}
              className="font-mono text-sm uppercase text-azure-bright"
            >
              Available on
            </motion.p>
            <div className="relative mt-3 flex h-[72px] items-center justify-center sm:h-[88px]">
              <AnimatePresence>
                <motion.span
                  key={`glow-${wi}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="pointer-events-none absolute h-16 w-72 rounded-full blur-2xl"
                  style={{ background: WALLETS[wi].glow }}
                />
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wi}
                  data-text={WALLETS[wi].name}
                  initial={{ opacity: 0, x: 10, skewX: -8 }}
                  animate={{ opacity: [0, 1, 0.55, 1], x: [-8, 5, -2, 0], skewX: [8, -5, 2, 0] }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.4, delay: wi === 0 ? 0.4 : 0 }}
                  className={`glitch relative text-5xl font-bold tracking-tight sm:text-6xl ${WALLETS[wi].color}`}
                >
                  {WALLETS[wi].name}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="mx-auto mt-2.5 h-[2px] w-48 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                key={`bar-${wi}`}
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full w-full"
                style={{ background: WALLETS[wi].bar }}
              />
            </div>
            <p className="mt-3 text-xl font-medium text-mist-dim">wallet</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const WALLETS = [
  { name: 'FOMO', color: 'text-white', bar: '#E8ECF4', glow: 'rgba(232,236,244,0.22)' },
  { name: 'Phantom', color: 'text-[#AB9FF2]', bar: '#AB9FF2', glow: 'rgba(171,159,242,0.30)' },
  { name: 'Coinbase', color: 'text-[#4A80FF]', bar: '#4A80FF', glow: 'rgba(74,128,255,0.30)' },
]

// Act 7: hand-off to the live simulation, then the page glides down
function ActOutro() {
  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="w-full px-4 text-center"
    >
      <Float amt={6} dur={5}>
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, ease: EASE }}
          className="text-3xl font-bold tracking-[-0.02em] sm:text-5xl"
        >
          Check out how your position earns
        </motion.h2>
      </Float>
      <Float delay={0.3} amt={5} dur={5.5}>
        <motion.p
          initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
          className="text-shimmer mt-3 text-2xl font-semibold sm:text-3xl"
        >
          in a real-time simulation
        </motion.p>
      </Float>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.4 }}
        className="mt-10 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-azure/40 bg-azure/10 text-azure shadow-[0_0_30px_-8px_rgba(46,155,255,0.6)]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path
              d="M5 9l7 7 7-7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Final frame: floating end card, seen when people scroll back up
function ActEnd() {
  return (
    <div className="w-full px-4 text-center">
      <Float amt={8} dur={5}>
        <h1 className="text-5xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-7xl">
          Buy XPY.
          <br />
          Earn <span className="text-shimmer">XRP</span>.
        </h1>
      </Float>
      <Float delay={0.4} amt={5} dur={6}>
        <p className="mt-6 font-mono text-sm uppercase tracking-[0.28em] text-azure-bright">
          Passively · Hourly · On-chain
        </p>
      </Float>
      <Float delay={0.7} amt={6} dur={5.5}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2.5 rounded-full bg-azure px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-azure-bright hover:shadow-[0_0_36px_-8px_rgba(46,155,255,0.6)]"
          >
            <XrpMark className="h-4 w-4" strokeWidth={4} />
            Buy XPY
          </a>
          <a href="#how" className="btn-secondary">How Virtual Mining Works</a>
        </motion.div>
      </Float>
    </div>
  )
}

/* ---------------------------------- hero ----------------------------------- */

// title → phone → sleep → reserve → portal → story → outro (scrolls down) → end card
const ACT_DURATIONS = [3350, 3900, 3800, 4200, 5800, 9600, 3000]

export default function Hero() {
  const [notifs, setNotifs] = useState(() => Array.from({ length: 4 }, makeNotif).reverse())
  const [act, setAct] = useState(0)

  useEffect(() => {
    const ping = setInterval(() => {
      setNotifs((prev) => [makeNotif(), ...prev].slice(0, 5))
    }, 3200)
    return () => clearInterval(ping)
  }, [])

  useEffect(() => {
    if (act >= 7) return
    const t = setTimeout(() => setAct(act + 1), ACT_DURATIONS[act])
    return () => clearTimeout(t)
  }, [act])

  // during the outro, glide the page down to the live simulation
  // (only if the viewer hasn't already scrolled away on their own)
  useEffect(() => {
    if (act !== 6) return
    if (window.scrollY > 120) return
    const t = setTimeout(() => {
      document.getElementById('drip')?.scrollIntoView({ behavior: 'smooth' })
    }, 2300)
    return () => clearTimeout(t)
  }, [act])

  return (
    <section className="relative overflow-x-clip pt-16">
      {/* XRP-blue washes */}
      <div className="pointer-events-none absolute -top-56 left-1/3 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-azure-deep/[0.22] blur-[150px]" />
      <div className="pointer-events-none absolute right-[-180px] top-1/4 h-[420px] w-[420px] rounded-full bg-azure/[0.07] blur-[120px]" />

      {/* giant watermark X */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [-6, -2, -6] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-40 top-24"
      >
        <XrpMark className="h-[560px] w-[560px] text-azure opacity-[0.05]" strokeWidth={2.2} />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
          <AnimatePresence mode="wait">
            {act === 0 && <ActTitle key="act-title" />}
            {act === 1 && <ActPhone key="act-phone" notifs={notifs} />}
            {act === 2 && <ActSleep key="act-sleep" />}
            {act === 3 && <ActReserve key="act-reserve" />}
            {act === 4 && <ActPortal key="act-portal" />}
            {act === 5 && <ActStory key="act-story" />}
            {act === 6 && <ActOutro key="act-outro" />}
            {act === 7 && (
              <motion.div
                key="act-end"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="w-full"
              >
                <ActEnd />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
