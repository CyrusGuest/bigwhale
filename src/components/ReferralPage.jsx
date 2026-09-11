import { useEffect, useState } from 'react'
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
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ delay: 0.85, duration: 0.7, ease: EASE }}
          className="mt-8 font-mono text-sm uppercase text-azure-bright"
        >
          10% of everything your friends earn
        </motion.p>
      </Float>
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

      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* the wheel */}
        <div className="relative mx-auto h-[300px] w-[300px] sm:h-[380px] sm:w-[380px]">
          {/* rotating dashed ring, speeds up at the finale */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: fast ? 7 : 18, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-6 rounded-full border-2 border-dashed border-azure/30"
          />
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
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full text-white ring-1 ring-azure/50 shadow-[0_0_50px_-8px_rgba(46,155,255,0.8)]"
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
        <div className="space-y-5">
          {WHEEL_BEATS.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 60 }}
              animate={beat > i ? { opacity: 1, x: 0 } : {}}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="flex items-start gap-4"
            >
              <span
                className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full font-display text-[14px] font-bold ${
                  i === 3 ? 'bg-azure text-white' : 'bg-white/[0.08] text-azure-bright ring-1 ring-white/[0.12]'
                }`}
              >
                {i + 1}
              </span>
              <p
                className={`text-[15px] leading-relaxed sm:text-[17px] ${
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

const ACT_DURATIONS = [3000, 4600, 10600]

export default function ReferralPage() {
  const [act, setAct] = useState(0)

  useEffect(() => {
    if (act >= 3) return
    const t = setTimeout(() => setAct(act + 1), ACT_DURATIONS[act])
    return () => clearTimeout(t)
  }, [act])

  return (
    <div className="relative overflow-x-clip pt-16">
      <div className="pointer-events-none absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-azure-deep/[0.16] blur-[140px]" />

      {act < 3 ? (
        <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
          <AnimatePresence mode="wait">
            {act === 0 && <ActTitle key="ref-title" />}
            {act === 1 && <ActFlow key="ref-flow" />}
            {act === 2 && <ActFlywheel key="ref-flywheel" />}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-6xl px-6 pb-24 pt-14 sm:pt-20"
        >
          <div className="mb-12 text-center">
            <motion.p
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [0, 1.15, 1] }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow mb-6"
            >
              Referrals
            </motion.p>
            <Float amt={6} dur={5.5}>
              <motion.h1
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="font-display text-4xl font-semibold tracking-[-0.03em] sm:text-6xl"
              >
                Bring your friends.
              </motion.h1>
            </Float>
            <Float delay={0.4} amt={7} dur={5}>
              <motion.h1
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12, duration: 0.5, ease: EASE }}
                className="font-display text-4xl font-semibold tracking-[-0.03em] sm:text-6xl"
              >
                Earn <span className="text-shimmer">10% of their XRP.</span>
              </motion.h1>
            </Float>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
              className="mx-auto mt-5 max-w-xl text-lg text-mist-dim"
            >
              Every hour your friends get paid, you get a 10% match on top,
              funded by the 1/5 marketing &amp; referral slice of the fee.
              Their payouts never shrink. No caps, no expiry: your bonus
              scales with every friend, for as long as they hold.
            </motion.p>
          </div>

          <LinkCard />
          <StepCards />
          <FeeSplit />
          <RefCalculator />
          <RefDashboard />
        </motion.div>
      )}
    </div>
  )
}
