import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

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

// non-payout notifications rotate between payouts like a real lock screen
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
    body: '@xrpwhale: 1 XPY = 1 XRP. i said what i said.',
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
  if (kind === 'weather')
    return (
      <svg viewBox="0 0 38 38" className="h-full w-full">
        <defs>
          <linearGradient id="wxSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4FA9F6" />
            <stop offset="100%" stopColor="#1863C6" />
          </linearGradient>
        </defs>
        <rect width="38" height="38" fill="url(#wxSky)" />
        <circle cx="25" cy="13" r="5.5" fill="#FFD335" />
        <g fill="#FFFFFF">
          <circle cx="14" cy="23" r="5.5" />
          <circle cx="21.5" cy="21" r="6.5" />
          <rect x="8.5" y="22" width="21" height="7.5" rx="3.75" />
        </g>
      </svg>
    )
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
        <path
          d="M10 29V9h4.6l8.8 13.4V9H28v20h-4.6L14.6 15.6V29H10z"
          fill="url(#newsN)"
        />
      </svg>
    )
  return null
}

let notifCounter = 0
function makeNotif() {
  const n = ++notifCounter
  // every other notification is a payout; the rest cycle through the pool
  if (n % 2 === 1) {
    const usd = 40 + Math.random() * 70
    return { id: n, type: 'pay', amt: usd / XRP_PRICE, usd }
  }
  return { id: n, type: 'app', ...OTHER_NOTIFS[(n / 2 - 1) % OTHER_NOTIFS.length] }
}

export default function Hero() {
  const [notifs, setNotifs] = useState(() => Array.from({ length: 4 }, makeNotif).reverse())

  useEffect(() => {
    const ping = setInterval(() => {
      setNotifs((prev) => [makeNotif(), ...prev].slice(0, 5))
    }, 3200)
    return () => clearInterval(ping)
  }, [])

  return (
    <section className="relative overflow-hidden pt-16">
      {/* XRP-blue washes */}
      <div className="pointer-events-none absolute -top-56 left-1/3 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-azure-deep/[0.22] blur-[150px]" />
      <div className="pointer-events-none absolute right-[-180px] top-1/4 h-[420px] w-[420px] rounded-full bg-azure/[0.07] blur-[120px]" />

      {/* giant watermark X behind the right column */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [-6, -2, -6] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-40 top-24"
      >
        <XrpMark className="h-[560px] w-[560px] text-azure opacity-[0.05]" strokeWidth={2.2} />
      </motion.div>

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 pb-28 pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-32">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-azure/25 bg-azure/[0.06] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-azure-bright"
          >
            <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-azure" />
            First pair live: XPY / XRP · Paying hourly
          </motion.div>

          <motion.h1
            variants={item}
            className="font-sans text-5xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-[4.4rem]"
          >
            Buy XPY.
            <br />
            Get paid in <span className="text-shimmer">XRP</span>.
          </motion.h1>

          <motion.p variants={item} className="mt-7 max-w-lg text-lg leading-relaxed text-mist-dim">
            The virtual XRP algorithm miner. Hold XPY and get paid in real
            XRP every hour, automatically. The algorithm collects a 5% fee
            from every trade and sends most of it straight to holders&rsquo;
            wallets. No hardware. No staking. No claiming. You hold, you get
            paid, even while you sleep. Rewards rise and fall with trading
            volume and are never guaranteed.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2.5 rounded-full bg-azure px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-azure-bright hover:shadow-[0_0_36px_-8px_rgba(46,155,255,0.6)]"
            >
              <XrpMark className="h-4 w-4" strokeWidth={4} />
              Buy XPY
            </a>
            <a href="#how" className="btn-secondary">How Virtual Mining Works</a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex max-w-lg items-center justify-between gap-5 rounded-md border border-azure/20 bg-gradient-to-r from-azure-deep/[0.16] to-transparent px-6 py-5"
          >
            <div className="flex items-start gap-4">
              <span className="mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-azure/40 bg-ink-900 text-azure">
                <XrpMark className="h-5 w-5" strokeWidth={4} />
              </span>
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-azure-bright">
                    XRP Reserve
                  </span>
                  <span className="border border-brass/40 bg-brass/[0.06] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-brass">
                    Attestation pending
                  </span>
                </div>
                <span className="mt-1 block font-serif text-2xl font-medium text-mist">
                  $1,000,000 in XRP
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-mist-faint">
                  A treasury held in a public on-ledger account, audit it any
                  time. Not redemption backing.
                </span>
              </div>
            </div>
            <a
              href="#reserve"
              className="flex-none font-mono text-xs text-azure transition-colors hover:text-azure-bright"
            >
              Verify →
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-white/[0.08] border-t border-white/[0.08] pt-6"
          >
            {[
              ['5%', 'Fee per trade'],
              ['4/5', 'Of fee to holders'],
              ['Hourly', 'Paid in XRP'],
            ].map(([v, l], i) => (
              <div key={l} className={i ? 'pl-6' : ''}>
                <span className="block font-serif text-2xl text-mist">{v}</span>
                <span className="mt-1 block text-[11px] uppercase tracking-[0.12em] text-mist-faint">
                  {l}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* phone on the nightstand: paid while you sleep */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center"
        >
          {/* ambient night glow */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-azure-deep/[0.28] blur-[100px]" />

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
                                <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[9.5px] bg-gradient-to-b from-azure to-[#1668c9] text-white shadow-md shadow-azure/25">
                                  <XrpMark className="h-[19px] w-[19px]" strokeWidth={4.5} />
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
        </motion.div>
      </div>
    </section>
  )
}
