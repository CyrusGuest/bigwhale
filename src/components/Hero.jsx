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
                  <div className="mt-2 text-[15px] font-medium text-white/70">Tuesday, 3:47 AM</div>
                  <div className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-[68px] font-semibold leading-[1.05] tracking-tight text-transparent">
                    3:47
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
        Simulated preview · Payouts land hourly, even at 3 AM
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

// Act 1: the whole screen is just the core message
function ActTitle() {
  return (
    <motion.div exit={actExit} className="w-full px-4 text-center">
      {['BUY XPY.', 'EARN XRP.'].map((line, i) => (
        <Float key={line} delay={i * 0.6} amt={7} dur={4.5}>
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.15 + i * 0.25, duration: 0.55, ease: EASE }}
            className="text-6xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-8xl"
          >
            {i === 1 ? (
              <>
                EARN <span className="text-shimmer">XRP</span>.
              </>
            ) : (
              line
            )}
          </motion.h1>
        </Float>
      ))}
      <Float delay={0.9} amt={5} dur={5.5}>
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.12em' }}
          animate={{ opacity: 1, letterSpacing: '0.5em' }}
          transition={{ delay: 0.75, duration: 0.7, ease: EASE }}
          className="mt-8 font-mono text-sm uppercase text-azure-bright sm:text-base"
        >
          Passively · Hourly
        </motion.p>
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
            className="mt-7 font-mono text-sm uppercase tracking-[0.3em] text-azure-bright"
          >
            Real XRP · Straight to your wallet
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

// Act 3: the condensed making-history explanation
function ActHistory() {
  return (
    <motion.div exit={actExit} className="w-full px-4 text-center">
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
  )
}

const WALLETS = [
  { name: 'FOMO', color: 'text-white', bar: '#E8ECF4', glow: 'rgba(232,236,244,0.22)' },
  { name: 'Phantom', color: 'text-[#AB9FF2]', bar: '#AB9FF2', glow: 'rgba(171,159,242,0.30)' },
  { name: 'Coinbase', color: 'text-[#4A80FF]', bar: '#4A80FF', glow: 'rgba(74,128,255,0.30)' },
]

// Act 4: availability, in the middle of it all
function ActWallets() {
  const [wi, setWi] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setWi(1), 1500)
    const t2 = setTimeout(() => setWi(2), 2900)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])
  return (
    <motion.div exit={actExit} className="w-full px-4 text-center">
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.12em' }}
        animate={{ opacity: 1, letterSpacing: '0.5em' }}
        transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
        className="font-mono text-sm uppercase text-azure-bright"
      >
        Available on
      </motion.p>
      <div className="relative mt-5 flex h-[92px] items-center justify-center sm:h-[110px]">
        <AnimatePresence>
          <motion.span
            key={`glow-${wi}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute h-20 w-80 rounded-full blur-2xl"
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
            transition={{ duration: 0.4, delay: wi === 0 ? 0.5 : 0 }}
            className={`glitch relative text-6xl font-bold tracking-tight sm:text-8xl ${WALLETS[wi].color}`}
          >
            {WALLETS[wi].name}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="mx-auto mt-3 h-[2px] w-56 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          key={`bar-${wi}`}
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full w-full"
          style={{ background: WALLETS[wi].bar }}
        />
      </div>
      <p className="mt-4 text-2xl font-medium text-mist-dim">wallet</p>
    </motion.div>
  )
}

// Final frame: floating end card, stays until refresh
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
        <p className="mt-6 font-mono text-sm uppercase tracking-[0.4em] text-azure-bright">
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

// title → phone → history → wallets → end card, then push down to the site
const ACT_DURATIONS = [2600, 5200, 4400, 4400]

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
    if (act >= 4) return
    const t = setTimeout(() => setAct(act + 1), ACT_DURATIONS[act])
    return () => clearTimeout(t)
  }, [act])

  // when the sequence ends, push the site down to the next section
  // (only if the viewer hasn't already scrolled away on their own)
  useEffect(() => {
    if (act !== 4) return
    if (window.scrollY > 120) return
    const t = setTimeout(() => {
      document.getElementById('drip')?.scrollIntoView({ behavior: 'smooth' })
    }, 1400)
    return () => clearTimeout(t)
  }, [act])

  return (
    <section className="relative overflow-hidden pt-16">
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
            {act === 2 && <ActHistory key="act-history" />}
            {act === 3 && <ActWallets key="act-wallets" />}
            {act === 4 && (
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
