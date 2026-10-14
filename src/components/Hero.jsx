import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from './Stars.jsx'
import { REVEAL } from '../motionPrefs.js'
import ContractAddress, { BUY_URL } from './ContractAddress.jsx'
import AirdropCountdown, { useNextAirdrop, formatCountdown } from './AirdropCountdown.jsx'
import { UsoLink } from './Uso.jsx'
import { useSummary } from '../portalData.js'

// Oil mark: a single crude drop, outlined in the current color with a faint
// fill and a specular highlight, so it reads at favicon size and at 560px
export function OilMark({ className = '', strokeWidth = 5 }) {
  const sw = Math.min(strokeWidth, 3.6)
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path
        d="M16 3.2 C16 3.2 6.4 14.2 6.4 20.4 A9.6 9.6 0 0 0 25.6 20.4 C25.6 14.2 16 3.2 16 3.2 Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path
        d="M11.2 20.6 A4.9 4.9 0 0 0 14.6 25.1"
        stroke="currentColor"
        strokeWidth={Math.max(sw * 0.55, 1.1)}
        strokeLinecap="round"
        opacity="0.9"
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
    body: '@XTOOFFICIAL: This hour’s fees bought 7.07 USOon on-chain and paid 923 wallets. Next round at :26.',
    hl: '7.07 USOon',
  },
  {
    app: 'Stocks',
    icon: 'stocks',
    body: 'WTI Crude $78.40 (+1.8%) · $USO +5.2% · XTO +3.1%',
  },
  {
    app: 'News',
    icon: 'news',
    body: 'U.S. crude output holds near record highs as American energy demand climbs',
    hl: 'record highs',
  },
  {
    app: 'X',
    icon: 'x',
    body: '@XTOOFFICIAL: 24 distributions in the last 24 hours. Every one of them on the ledger.',
    hl: '24 distributions',
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
        <div className="relative rounded-[3.2rem] bg-gradient-to-b from-[#55607a] via-[#2a3147] to-[#171c2e] p-[3px] shadow-[0_44px_110px_-24px_rgba(0,0,0,0.9),0_0_90px_-28px_rgba(50,231,208,0.45)]">
          {/* side buttons */}
          <div className="absolute -left-[2.5px] top-[104px] h-7 w-[3px] rounded-l-full bg-gradient-to-b from-[#5b6680] to-[#2a3147]" />
          <div className="absolute -left-[2.5px] top-[144px] h-12 w-[3px] rounded-l-full bg-gradient-to-b from-[#5b6680] to-[#2a3147]" />
          <div className="absolute -left-[2.5px] top-[204px] h-12 w-[3px] rounded-l-full bg-gradient-to-b from-[#5b6680] to-[#2a3147]" />
          <div className="absolute -right-[2.5px] top-[160px] h-[70px] w-[3px] rounded-r-full bg-gradient-to-b from-[#5b6680] to-[#2a3147]" />

          {/* black bezel */}
          <div className="rounded-[3.05rem] bg-black p-[9px]">
            {/* screen */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0A0908]">
              {/* wallpaper glow */}
              <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-deep/40 blur-[70px]" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-gold/10 blur-[60px]" />
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
                  <div className="mt-2 text-[15px] font-medium text-white/70">Tuesday, 3:47 AM</div>
                  <div className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-[68px] font-semibold leading-[1.05] tracking-tight text-transparent">
                    3:47
                  </div>
                </div>

                {/* notifications: fixed-height stage so the phone never resizes */}
                <div className="relative mt-4 h-[280px] overflow-hidden">
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-[#0A0908] to-transparent" />
                  <div className="flex flex-col gap-2">
                    <AnimatePresence initial={false} mode="popLayout">
                      {notifs.map((n, i) => (
                        <motion.div
                          key={n.id}
                          layout
                          initial={{ opacity: 0, y: -68, scale: 0.82, filter: 'blur(5px)' }}
                          animate={{
                            opacity: 1 - i * 0.14,
                            y: 0,
                            scale: 1 - i * 0.02,
                            filter: 'blur(0px)',
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.92,
                            transition: { duration: 0.28, ease: 'easeIn' },
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 320,
                            damping: 33,
                            mass: 1,
                            opacity: { duration: 0.45, ease: 'easeOut' },
                            filter: { duration: 0.4, ease: 'easeOut' },
                            layout: { type: 'spring', stiffness: 300, damping: 34 },
                          }}
                          className="rounded-[24px] bg-[#1d1f27]/80 p-3.5 shadow-[0_10px_26px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.09)] backdrop-blur-2xl"
                        >
                          <div className="flex items-start gap-3">
                            {n.type === 'pay' ? (
                              <span className="h-[40px] w-[40px] flex-none overflow-hidden rounded-[10px] shadow-md shadow-black/30 ring-1 ring-white/10">
                                <img src="/logo.png" alt="" width={512} height={512} className="h-full w-full" />
                              </span>
                            ) : (
                              <span className="h-[40px] w-[40px] flex-none overflow-hidden rounded-[10px] shadow-md shadow-black/30">
                                <AppIcon kind={n.icon} />
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="text-[15px] font-semibold leading-tight text-white">
                                  {n.type === 'pay' ? 'XTO' : n.app}
                                </span>
                                <span className="text-[12px] text-white/45">
                                  {i === 0 ? 'now' : `${i}h ago`}
                                </span>
                              </div>
                              {n.type === 'pay' ? (
                                <p className="mt-[2px] text-[14px] leading-[1.32] text-white/85">
                                  You just got paid{' '}
                                  <span className="font-semibold text-[#7CF5E6]">
                                    ${n.usd.toFixed(2)}
                                  </span>{' '}
                                  of $USO
                                </p>
                              ) : (
                                <p className="mt-[2px] text-[14px] leading-[1.32] text-white/85">
                                  {n.hl ? (
                                    <>
                                      {n.body.split(n.hl)[0]}
                                      <span className="font-semibold text-[#7CF5E6]">{n.hl}</span>
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
        Simulated preview · Payouts land hourly, even at 3:47 AM
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
      // own compositor layer: shadowed display text rasterises once and moves
      // on the GPU instead of repainting every frame
      style={{ willChange: 'transform' }}
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
          className="absolute text-gold"
        >
          <OilMark className="h-5 w-5" strokeWidth={4} />
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
      className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-[min(88vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/25 blur-3xl"
    />
  )
}

function ActTitle() {
  return (
    <motion.div exit={actExit} className="relative w-full px-4 text-center">
      <Float amt={8} dur={5} delay={1.8}>
        {/* line 1: BUY + XTO. slam in from opposite sides and collide */}
        <div className="relative flex flex-wrap items-center justify-center gap-x-5">
          {REVEAL && <ImpactPulse delay={0.55} />}
          {REVEAL && <Burst delay={0.55} />}
          <motion.span
            initial={{ x: '-70vw', rotate: -14, opacity: 0 }}
            animate={{ x: 0, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.12, type: 'spring', stiffness: 230, damping: 16 }}
            style={{ willChange: 'transform' }}
            className="text-3d inline-block text-6xl font-bold tracking-[-0.03em] sm:text-8xl lg:text-9xl"
          >
            BUY
          </motion.span>
          <motion.span
            initial={{ x: '70vw', rotate: 14, opacity: 0 }}
            animate={{ x: 0, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.26, type: 'spring', stiffness: 230, damping: 16 }}
            style={{ willChange: 'transform' }}
            className="text-3d inline-block text-6xl font-bold tracking-[-0.03em] sm:text-8xl lg:text-9xl"
          >
            XTO.
          </motion.span>
        </div>

        {/* line 2: drops from above and bounces on landing */}
        <div className="relative">
          {REVEAL && <ImpactPulse delay={1.25} />}
          {REVEAL && <Burst delay={1.25} />}
          <motion.h1
            initial={{ y: '-58vh', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 210, damping: 13 }}
            style={{ willChange: 'transform' }}
            className="text-3d origin-bottom text-6xl font-bold leading-[1.1] tracking-[-0.03em] sm:text-8xl lg:text-9xl"
          >
            EARN <UsoLink className="text-shimmer" />.
          </motion.h1>
        </div>

        {/* tagline words pop like impacts */}
        <div className="mt-7 flex items-center justify-center gap-3 font-mono text-sm uppercase tracking-[0.3em] text-gold-deep sm:text-base">
          {['For', 'the', 'American', 'people'].map((w, i) => (
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
            transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 flex flex-wrap justify-center gap-x-2 font-mono text-sm uppercase tracking-[0.3em] text-gold-deep lg:justify-start"
          >
            {['Real', 'Oil', '·', 'Straight', 'to', 'your', 'wallet'].map((w, i) => (
              <motion.span
                key={i}
                animate={{
                  scale: [1, w === '·' ? 1 : w === 'Real' || w === 'Oil' ? 1.38 : 1.22, 1],
                  color: ['#3127CC', '#8A82FF', '#3127CC'],
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
        <div className="breathe pointer-events-none absolute top-1/2 left-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-deep/[0.28] blur-[100px]" />
        {/* z z z drifting off the sleeping phone */}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0], y: [0, -70 - i * 12], x: [0, 16 + i * 10] }}
            transition={{
              delay: 1.6 + i * 0.85,
              duration: 2.7,
              repeat: Infinity,
              repeatDelay: 0.3,
              ease: 'easeOut',
            }}
            className="pointer-events-none absolute right-[18%] top-16 font-bold text-gold-deep"
            style={{ fontSize: 15 + i * 7 }}
          >
            z
          </motion.span>
        ))}
        <PhoneMock notifs={notifs} />
      </motion.div>
    </motion.div>
  )
}

// Act 3: earning in your sleep — payout cards fly in from the screen edges
const SLEEP_DROPS = [
  { t: '3:47 AM', amt: 44.01 },
  { t: '4:47 AM', amt: 38.99 },
  { t: '5:47 AM', amt: 47.73 },
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
              className="mx-auto flex w-full max-w-md items-start gap-3 rounded-[24px] bg-[#1d1f27]/85 p-4 text-left shadow-[0_14px_34px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.09)] backdrop-blur-2xl"
            >
              <span className="h-[40px] w-[40px] flex-none overflow-hidden rounded-[10px] shadow-md shadow-black/30 ring-1 ring-white/10">
                <img src="/logo.png" alt="" width={512} height={512} className="h-full w-full" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-semibold text-white">XTO</span>
                  <span className="text-[12px] text-white/45">{d.t}</span>
                </div>
                <p className="mt-[2px] text-[14px] leading-[1.32] text-white/85">
                  You just got paid{' '}
                  <span className="font-semibold text-[#7CF5E6]">${d.amt.toFixed(2)}</span> of $USO
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <Float delay={1.1} amt={5} dur={5}>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap justify-center gap-x-2 font-mono text-sm uppercase tracking-[0.26em] text-gold-deep"
          >
            {['$130.73', 'of', 'oil', 'stock', 'while', 'you', 'slept'].map((w, i) => (
              <motion.span
                key={i}
                animate={{
                  scale: [1, i < 2 ? 1.35 : 1.18, 1],
                  color: ['#3127CC', '#8A82FF', '#3127CC'],
                }}
                transition={{
                  delay: 2.3 + i * 0.14,
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: 'easeInOut',
                }}
                className="inline-block origin-center"
              >
                {w}
              </motion.span>
            ))}
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

// Act 4: fees bought $USO and paid it out, rolling up to the live ledger total
function ActFees() {
  const { summary } = useSummary(60_000)
  const paid = Math.round(summary?.totals?.usd_distributed || 68270)
  return (
    <motion.div exit={actExit} className="w-full px-4 text-center">
      <Float amt={5} dur={5.5}>
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.34em' }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
          className="font-mono text-sm uppercase text-gold-deep"
        >
          Fees, not promises
        </motion.p>
      </Float>
      <Float delay={0.3} amt={9} dur={4.8}>
        <div className="relative">
          {/* sonar rings pulsing out from the number */}
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.35, 0], scale: [0.8, 1.6] }}
              transition={{
                delay: 2.6 + i * 1.5,
                duration: 3,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-[min(82vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/40"
            />
          ))}
          <motion.h2
            initial={{ opacity: 0, scale: 1.3, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.35, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-6xl font-bold tabular-nums tracking-[-0.03em] text-mist [text-shadow:0_0_60px_rgba(50,231,208,0.45)] sm:text-8xl"
          >
            {/* heartbeat once the roll-up settles */}
            <motion.span
              animate={{ scale: [1, 1.035, 1] }}
              transition={{ delay: 2.5, duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              <RollUp target={paid} prefix="$" dur={1.8} delay={0.5} />
            </motion.span>
          </motion.h2>
        </div>
      </Float>
      <Float delay={0.6} amt={6} dur={5.2}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5, ease: EASE }}
          className="mt-5 text-2xl font-medium text-mist sm:text-3xl"
        >
          of <UsoLink className="text-shimmer" /> bought with trading fees and paid to holders
        </motion.p>
      </Float>
      <Float delay={0.9} amt={4} dur={6}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-mist-faint"
        >
          Every trade pays 4% · The fee buys USOon on-chain · Sent to every wallet hourly
        </motion.p>
      </Float>
    </motion.div>
  )
}

// Act 5: your earnings curve draws itself live, payouts popping along the way
const PORTAL_PTS = [0, 5, 8, 14, 17, 24, 28, 35, 39, 47, 54, 62]
const PORTAL_POPS = [
  { i: 4, label: '+$11,272' },
  { i: 8, label: '+$17,326' },
  { i: 11, label: '+$51,384' },
]

function ActPortal() {
  // the real clock: read from the runner's published epoch timing
  const nextDrop = useNextAirdrop()
  const payoutLabel = nextDrop.sending ? 'sending' : formatCountdown(nextDrop.seconds)

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
          className="mx-auto mt-8 w-full max-w-xl rounded-lg border border-navy/10 bg-ink-900/85 p-6 text-left shadow-2xl shadow-navy/20 backdrop-blur"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-mist-faint">
                <UsoLink /> earned, all time
              </span>
              <span className="mt-1 block font-mono text-3xl font-semibold tabular-nums text-mist sm:text-4xl">
                <RollUp target={51384} prefix="$" dur={1.9} delay={1.1} />
              </span>
              <span className="mt-0.5 block font-mono text-sm tabular-nums text-gold-deep">
                worth of <UsoLink />, paid to one wallet
              </span>
            </div>
            <div className="pb-1 text-right">
              <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-mist-faint">
                Next payout
              </span>
              <span className="mt-1 block font-mono text-lg tabular-nums text-mist">
                {payoutLabel}
              </span>
            </div>
          </div>

          <div className="relative mt-4">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
              <defs>
                <linearGradient id="actPortalArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#32E7D0" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#32E7D0" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d={`${line} L${px(PORTAL_PTS.length - 1)},${H - 14} L14,${H - 14} Z`}
                fill="url(#actPortalArea)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: drawStart + drawDur - 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.path
                d={line}
                fill="none"
                stroke="#32E7D0"
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
                  fill="#3127CC"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [0, 1.6, 1] }}
                  transition={{ delay: popDelay(i), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
                className="absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full border border-gold/40 bg-ink-900/95 px-3 py-1 font-mono text-[11px] font-medium text-gold-deep shadow-lg shadow-gold/20"
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
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/[0.08] px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-gold-deep transition-colors hover:bg-gold/[0.15]"
        >
          Open your Holder Portal →
        </motion.a>
      </Float>
    </motion.div>
  )
}

// Act 6: making history, then availability pops in beneath it
function ActStory({ played }) {
  const [showWallets, setShowWallets] = useState(false)
  const [wi, setWi] = useState(0)
  useEffect(() => {
    // driven by the intro's play-time, so a remount (after the hero scrolls
    // back into view) lands exactly on the beat it paused on: wallets appear
    // at 2.8s into the act, names advance every 1.05s from 3.9s
    const tick = () => {
      const elapsed = (played?.current ?? 0) - STORY_OFFSET
      if (elapsed >= 2800) setShowWallets(true)
      const step = Math.floor((elapsed - 3900) / 1050)
      const next = Math.max(0, Math.min(WALLETS.length - 1, step))
      setWi(next)
      return next >= WALLETS.length - 1
    }
    if (tick()) return
    const iv = setInterval(() => {
      if (tick()) clearInterval(iv)
    }, 120)
    return () => clearInterval(iv)
  }, [played])
  return (
    <motion.div exit={actExit} className="w-full px-4 text-center">
      <motion.div layout transition={{ layout: { duration: 0.55, ease: EASE } }}>
      <Float amt={5} dur={5.5}>
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.42em' }}
          transition={{ delay: 0.05, duration: 0.7, ease: EASE }}
          className="font-mono text-xs uppercase text-gold-deep"
        >
          XTO is the first
        </motion.p>
      </Float>
      <Float delay={0.3} amt={8} dur={4.8}>
        <motion.h2
          initial={{ opacity: 0, scale: 1.25, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-luster mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-[-0.02em] sm:text-6xl"
        >
          Virtual Oil Drilling Algorithm
        </motion.h2>
      </Float>
      <div className="mx-auto mt-7 max-w-xl space-y-3">
        {[
          'A movement for the American people.',
          'Everyone gets a piece of the oil market. Every hour.',
        ].map((line, i) => (
          <Float key={line} delay={0.6 + i * 0.4} amt={5} dur={5.8}>
            <motion.p
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.85 + i * 0.35, duration: 0.45, ease: EASE }}
              className="text-lg text-mist-dim sm:text-xl"
            >
              <motion.span
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{
                  delay: 2 + i * 1.2,
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="inline-block"
              >
                {line}
              </motion.span>
            </motion.p>
          </Float>
        ))}
      </div>
      <div className="relative mt-7 flex h-[72px] items-center justify-center sm:h-[84px]">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.55, 0], scale: [0.5, 1.5, 1.9] }}
          transition={{ delay: 2.15, duration: 0.8, ease: 'easeOut' }}
          className="pointer-events-none absolute h-20 w-80 rounded-full bg-blue/20 blur-2xl"
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
              className="glitch text-shimmer inline-block font-serif text-4xl font-bold tracking-[0.04em] sm:text-5xl"
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
              className="font-mono text-sm uppercase text-gold-deep"
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
            <div className="mx-auto mt-2.5 h-[2px] w-48 overflow-hidden rounded-full bg-navy/10">
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
  { name: 'Candles', color: 'text-[#22C55E]', bar: '#22C55E', glow: 'rgba(34,197,94,0.30)' },
  { name: 'FOMO', color: 'text-navy', bar: '#32E7D0', glow: 'rgba(50,231,208,0.25)' },
  { name: 'Phantom', color: 'text-[#AB9FF2]', bar: '#AB9FF2', glow: 'rgba(171,159,242,0.30)' },
  { name: 'Coinbase', color: 'text-[#4A80FF]', bar: '#4A80FF', glow: 'rgba(74,128,255,0.30)' },
  { name: 'Robinhood', color: 'text-[#00C805]', bar: '#00C805', glow: 'rgba(0,200,5,0.28)' },
  { name: 'Axiom', color: 'text-[#6C7BFF]', bar: '#6C7BFF', glow: 'rgba(108,123,255,0.30)' },
  { name: 'Photon', color: 'text-[#C084FC]', bar: '#C084FC', glow: 'rgba(192,132,252,0.30)' },
  { name: 'Jupiter', color: 'text-[#C7F284]', bar: '#C7F284', glow: 'rgba(199,242,132,0.28)' },
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
        transition={{ delay: 0.75, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold shadow-[0_0_30px_-8px_rgba(50,231,208,0.6)]"
        >
          <motion.span
            animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 rounded-full border border-gold/60"
          />
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

// end card: the resting state of the hero once the intro has played
function ActEnd() {
  return (
    <div className="w-full px-4 text-center">
      <Float amt={8} dur={5}>
        <p className="mb-6 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-gold-deep">
          <Star className="h-3 w-3" /> A movement for the American people <Star className="h-3 w-3" />
        </p>
        <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-[-0.015em] sm:text-7xl">
          Buy XTO.
          <br />
          Get paid in <UsoLink className="text-shimmer" />.
        </h1>
      </Float>
      <Float delay={0.4} amt={5} dur={6}>
        <p className="mt-6 font-mono text-sm uppercase tracking-[0.28em] text-gold-deep">
          US Oil Fund · Every hour · Open to every American
        </p>
        <div className="mt-4 flex justify-center">
          <AirdropCountdown className="!text-xs" />
        </div>
      </Float>
      <Float delay={0.7} amt={6} dur={5.5}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            animate={{ scale: [1, 1.045, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="btn-primary inline-flex items-center gap-2.5 !px-8 !py-4"
          >
            <OilMark className="h-4 w-4" strokeWidth={4} />
            Buy XTO
          </motion.a>
          <a href="#how" className="btn-secondary">How It Works</a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
          className="mt-7 flex justify-center"
        >
          <ContractAddress />
        </motion.div>
      </Float>
    </div>
  )
}

/* ---------------------------------- hero ----------------------------------- */

// title → phone → sleep → fees → portal → story → outro (scrolls down) → end card
const ACT_DURATIONS = [2950, 3900, 3800, 4200, 5000, 12750, 3000]
// wall-clock offset of the story act, for keeping its inner beats on schedule
const STORY_OFFSET = ACT_DURATIONS.slice(0, 5).reduce((s, d) => s + d, 0)
// a single clock tick never credits more than this: a long main-thread stall
// (first paint, font swap, GC) must not count as watched time, or it skips the
// title act before it ever paints. Ordinary slow frames still count in full,
// so a janky phone never stretches the timeline.
const MAX_TICK_MS = 1000
// how long to hold the intro for the web fonts before starting without them
const FONT_WAIT_MS = 2000

export default function Hero() {
  const [notifs, setNotifs] = useState(() => Array.from({ length: 4 }, makeNotif).reverse())
  // ?intro=0 skips straight to the end card (handy for reviewing the page);
  // section deep links (#faq etc.) also skip it so the anchor jump isn't fought
  const [act, setAct] = useState(() => {
    if (window.location.search.includes('intro=0')) return 7
    const h = window.location.hash.slice(1)
    if (h && !h.startsWith('/')) return 7
    return 0
  })

  // ms of intro actually PLAYED: advances only while the hero is on screen,
  // so a mid-page reload or a scroll-away never skips the opening acts — the
  // intro pauses and resumes exactly where it left off
  const playedRef = useRef(0)

  // while the hero is scrolled out of view, the timeline keeps running but we
  // stop RENDERING the acts: off-screen framer animations are main-thread
  // work on every frame and are what freezes mobile scrolling
  const sectionRef = useRef(null)
  const [heroVisible, setHeroVisible] = useState(true)
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), {
      threshold: 0.05,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!heroVisible) return
    const ping = setInterval(() => {
      setNotifs((prev) => [makeNotif(), ...prev].slice(0, 5))
    }, 3200)
    return () => clearInterval(ping)
  }, [heroVisible])

  // the intro doesn't start until the hero has painted a frame and the web
  // fonts are in (bounded wait). On phones the first commit plus the font
  // swap can stall the thread for seconds; starting the clock before that
  // meant the title act ran, or was skipped, with nothing on screen.
  const [started, setStarted] = useState(false)
  useEffect(() => {
    let cancelled = false
    let raf = 0
    const timeout = new Promise((r) => setTimeout(r, FONT_WAIT_MS))
    const cssReady = window.__fontsCss ?? Promise.resolve()
    const afterPaint = () =>
      new Promise((r) => {
        raf = requestAnimationFrame(() => {
          raf = requestAnimationFrame(r)
        })
      })
    const ready = cssReady
      // a painted frame kicks off the font loads, so only then is fonts.ready meaningful
      .then(afterPaint)
      .then(() => document.fonts?.ready ?? null)
      .then(afterPaint)
    Promise.race([ready, timeout]).then(() => {
      if (!cancelled) setStarted(true)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [])

  // the intro runs on accumulated play-time, not chained timers: mobile
  // browsers suspend timers mid-scroll, so each tick re-derives the current
  // act from how long the hero has actually been watched. While the hero is
  // off screen the clock pauses with it.
  useEffect(() => {
    if (act >= 7 || !heroVisible || !started) return
    const bounds = []
    let acc = 0
    for (const d of ACT_DURATIONS) {
      acc += d
      bounds.push(acc)
    }
    let last = performance.now()
    const iv = setInterval(() => {
      const now = performance.now()
      playedRef.current += Math.min(now - last, MAX_TICK_MS)
      last = now
      const idx = bounds.findIndex((b) => playedRef.current < b)
      setAct(idx === -1 ? 7 : idx)
      if (idx === -1) clearInterval(iv)
    }, 150)
    return () => clearInterval(iv)
  }, [act, heroVisible, started])

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

  const show = started && heroVisible
  return (
    <section ref={sectionRef} className="relative overflow-x-clip pt-16">
      {/* XRP-blue washes */}
      <div className="breathe pointer-events-none absolute -top-56 left-1/3 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-blue/[0.08] blur-[150px]" />
      <div className="breathe pointer-events-none absolute right-[-180px] top-1/4 h-[420px] w-[420px] rounded-full bg-gold/[0.10] blur-[120px]" />

      {/* giant watermark X */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [-6, -2, -6] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-40 top-24 hidden md:block"
      >
        <OilMark className="h-[560px] w-[560px] text-gold opacity-[0.05]" strokeWidth={2.2} />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
          <AnimatePresence mode="wait">
            {show && act === 0 && <ActTitle key="act-title" />}
            {show && act === 1 && <ActPhone key="act-phone" notifs={notifs} />}
            {show && act === 2 && <ActSleep key="act-sleep" />}
            {show && act === 3 && <ActFees key="act-fees" />}
            {show && act === 4 && <ActPortal key="act-portal" />}
            {show && act === 5 && (
              <ActStory key="act-story" played={playedRef} />
            )}
            {show && act === 6 && <ActOutro key="act-outro" />}
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
