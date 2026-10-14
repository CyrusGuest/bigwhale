import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNextAirdrop, formatCountdown } from './AirdropCountdown.jsx'
import { OilMark } from './Hero.jsx'
import { SOL_ADDRESS, fetchLiveBalance, fetchWallet, fmtNum, fmtUsd, timeAgo, useSummary } from '../portalData.js'

// Everything shown here comes from two public sources: the JSON the rewards runner publishes
// after every epoch (balances at each snapshot, every payout and its signature, the price each
// payout was bought at) and a read-only RPC call for the wallet's live balance. No wallet
// connection, no signing, nothing stored anywhere but this browser.

const LAST_ADDRESS_KEY = 'xto-portal-address'
const SOLSCAN = 'https://solscan.io/tx/'

function addressFromHash() {
  const parts = window.location.hash.split('/')
  const candidate = parts[2] ? decodeURIComponent(parts[2]) : ''
  return SOL_ADDRESS.test(candidate) ? candidate : ''
}

function rememberedAddress() {
  try {
    const v = localStorage.getItem(LAST_ADDRESS_KEY) || ''
    return SOL_ADDRESS.test(v) ? v : ''
  } catch {
    return ''
  }
}

function remember(address) {
  try {
    if (address) localStorage.setItem(LAST_ADDRESS_KEY, address)
    else localStorage.removeItem(LAST_ADDRESS_KEY)
  } catch {
    /* private mode */
  }
}

// cumulative USD per day over `range` days, missing days filled with zero
function cumulativeSeries(daily, range) {
  const byDate = new Map((daily || []).map((d) => [d.date, d.usd]))
  const out = []
  let acc = 0
  const today = new Date()
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setUTCDate(today.getUTCDate() - i)
    acc += byDate.get(d.toISOString().slice(0, 10)) || 0
    out.push(acc)
  }
  return out
}

function AreaChart({ points }) {
  const W = 620
  const H = 200
  const L = 10
  const R = 56
  const T = 14
  const B = 22
  const max = Math.max(...points, 0.01)
  const step = (W - L - R) / Math.max(points.length - 1, 1)
  const x = (i) => L + i * step
  const y = (v) => H - B - (v / max) * (H - T - B)
  const line = points.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const area = `${line} L${x(points.length - 1)},${H - B} L${L},${H - B} Z`
  const tick = (v) => (max < 1 ? v.toFixed(3) : max < 100 ? v.toFixed(1) : fmtNum(v, 0))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      <defs>
        <linearGradient id="pArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#32E7D0" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#32E7D0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.33, 0.66, 1].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(max * g)} y2={y(max * g)} stroke="#17172B" strokeOpacity="0.08" />
          <text x={W - R + 8} y={y(max * g) + 3.5} fill="#8685A8" fontSize="10" fontFamily="Inter">
            ${tick(max * g)}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#pArea)" />
      <path d={line} fill="none" stroke="#32E7D0" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r="4" fill="#32E7D0" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r="8" fill="#32E7D0" fillOpacity="0.25">
        <animate attributeName="r" values="6;11;6" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function Countdown() {
  const { seconds, sending } = useNextAirdrop()
  if (sending) return <span className="text-[#7CF5E6]">Sending</span>
  return <span className="tabular-nums">{formatCountdown(seconds)}</span>
}

// clean fintech card: white, ink hairline ring, one soft shadow
const glass =
  'rounded-2xl bg-white ring-1 ring-navy/[0.08] shadow-[0_16px_40px_-28px_rgba(23,23,43,0.28)]'

// the one deep surface: brand indigo night with a quiet aqua bloom in the corner
const night = {
  background: 'linear-gradient(135deg, #3B32E6 0%, #3127CC 55%, #2A22B8 100%)',
}

// why this wallet was or was not paid in the last completed epoch
function statusCopy(last, minHoldingUsd) {
  switch (last?.result) {
    case 'paid':
      return { tone: 'ok', title: `Paid in the last round`, body: `Credited with ${fmtNum(last.credited_balance, 0)} XTO held through the hour.` }
    case 'not held at open':
      return { tone: 'wait', title: 'Earning from the next round', body: 'This wallet bought during the last hour. Tokens must be held through a full round, so the first payout comes next.' }
    case 'below minimum holding':
      return { tone: 'warn', title: `Below the ${fmtUsd(minHoldingUsd, 0)} minimum`, body: 'The balance held through the last round was worth less than the minimum at the closing price.' }
    case 'not holding':
      return { tone: 'warn', title: 'No XTO at the last snapshot', body: 'Hold XTO through a full round to earn.' }
    case 'excluded':
      return { tone: 'warn', title: 'Not eligible', body: 'Team, pool and treasury wallets never earn.' }
    default:
      return { tone: 'wait', title: 'No rounds yet', body: 'The first payout lands after the first full round.' }
  }
}

function Dashboard({ address, wallet, liveBalance, summary }) {
  const [range, setRange] = useState(30)
  const series = useMemo(() => cumulativeSeries(wallet?.daily, range), [wallet, range])
  const rangeUsd = series[series.length - 1] || 0

  const xtoPrice = summary?.totals?.xto_price_usd || 0
  const balance = liveBalance ?? wallet?.balance ?? 0
  const supply = summary?.launch?.supply || 0
  const share = supply ? balance / supply : 0
  const positionUsd = balance * xtoPrice

  // pace: this wallet's share of the credited pot × the median hourly pot over the last day
  const pot = summary?.totals?.avg_pot_usd_24h || 0
  const sharePot = wallet?.last_epoch?.share_of_pot || 0
  const hourlyUsd = sharePot * pot
  const status = statusCopy(wallet?.last_epoch, summary?.launch?.min_holding_usd ?? 10)
  const symbol = summary?.launch?.reward_symbol || 'USO'
  const payouts = (wallet?.payouts || []).filter((p) => p.status === 'CONFIRMED').slice(0, 12)

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <span className="inline-flex items-center gap-2 rounded-full bg-navy/[0.05] px-3.5 py-1.5 text-[11px] font-medium text-mist-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Live · balance from the chain, payouts from the distribution ledger
        </span>
      </div>

      {/* account balance card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 ring-1 ring-white/[0.08] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.7)] sm:p-9"
        style={night}
      >
        <div className="breathe pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#32E7D0]/[0.14] blur-[80px]" />

        <div className="relative flex items-start justify-between">
          <span className="text-[13px] font-medium tracking-wide text-white/50">Total balance</span>
          <span className="flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-1.5 text-[12px] font-semibold text-[#7CF5E6]">
            <OilMark className="h-3.5 w-3.5" strokeWidth={5} />
            XTO
          </span>
        </div>

        <div className="relative mt-3 font-display text-4xl font-semibold tabular-nums tracking-[-0.025em] text-white sm:text-6xl lg:text-7xl">
          {fmtUsd(positionUsd, positionUsd < 100 ? 2 : 0)}
        </div>
        <div className="relative mt-2.5 font-display text-[15px] font-medium tabular-nums tracking-[-0.01em] text-white/55 sm:text-[16px]">
          {fmtNum(balance, balance < 1000 ? 2 : 0)} XTO · {(share * 100).toFixed(4)}% of supply
        </div>

        <div className="relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-mono text-[12px] tracking-wide text-[#7CF5E6]/70">
            {address.slice(0, 6)}····{address.slice(-4)}
          </span>
          <span className="text-[12px] text-white/35">
            Read-only · {liveBalance === null ? 'balance as of the last snapshot' : 'balance live'} · payouts update hourly
          </span>
        </div>
      </div>

      {/* stat tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: `$${symbol} earned, all time`,
            value: fmtUsd(wallet?.totals?.usd_all_time || 0),
            sub: `${fmtNum(wallet?.totals?.reward_all_time || 0, 6)} ${symbol} over ${wallet?.totals?.payouts || 0} payouts`,
          },
          {
            label: 'Last 30 days',
            value: fmtUsd(wallet?.totals?.usd_30d || 0),
            sub: `worth of $${symbol}`,
          },
          {
            label: 'Estimated hourly pace',
            value: hourlyUsd > 0 ? `${fmtUsd(hourlyUsd, hourlyUsd < 10 ? 2 : 0)} / hour` : '—',
            sub: hourlyUsd > 0 ? `your share × the median hourly pot (${fmtUsd(pot, 0)}) over the last day` : 'shown once this wallet has been paid a round',
          },
        ].map((k) => (
          <div key={k.label} className={`${glass} p-6`}>
            <span className="block text-[13px] font-medium text-mist-faint">{k.label}</span>
            <span className="mt-1.5 block font-display text-[26px] font-semibold tabular-nums tracking-[-0.02em] text-mist">
              {k.value}
            </span>
            <span className="mt-0.5 block text-[13px] tabular-nums text-mist-faint">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* earnings chart + side column */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className={`${glass} p-6 lg:col-span-2 sm:p-7`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-[16px] font-semibold text-mist">Earnings</h3>
              <span className="text-[13px] text-mist-faint">Cumulative ${symbol} received, valued at the price each payout was bought at</span>
            </div>
            <div className="flex overflow-hidden rounded-full bg-navy/[0.05] p-1 ring-1 ring-navy/[0.08]">
              {[7, 30].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${
                    range === r ? 'bg-gold text-mist shadow-sm' : 'text-mist-dim hover:text-mist'
                  }`}
                >
                  {r}D
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-[32px] font-semibold tabular-nums tracking-[-0.02em] text-mist">
              {fmtUsd(rangeUsd)}
            </span>
            <span className="font-display text-[16px] font-medium tabular-nums text-mist-faint">worth of ${symbol}</span>
          </div>
          <div className="mt-2">
            <AreaChart points={series} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div
            className="relative overflow-hidden rounded-2xl p-6 ring-1 ring-white/[0.08] shadow-[0_20px_44px_-24px_rgba(0,0,0,0.7)]"
            style={night}
          >
            <div className="breathe pointer-events-none absolute -right-16 -bottom-20 h-48 w-48 rounded-full bg-[#32E7D0]/[0.14] blur-[70px]" />
            <span className="relative text-[13px] font-medium text-white/50">Next payout</span>
            <div className="relative mt-2 font-display text-[40px] font-semibold tracking-[-0.02em] text-white">
              <Countdown />
            </div>
            <div className="relative mt-1.5 font-display text-[15px] font-medium text-[#7CF5E6]">
              {hourlyUsd > 0 ? `est. +${fmtUsd(hourlyUsd, 2)} of $${symbol} to this wallet` : `$${symbol}, deposited to eligible wallets`}
            </div>
            <p className="relative mt-3 text-[12px] leading-relaxed text-white/40">Deposited automatically. Nothing to claim.</p>
          </div>

          <div className={`${glass} flex-1 p-6`}>
            <h3 className="font-display text-[16px] font-semibold text-mist">Status</h3>
            <div className="mt-3 flex items-start gap-3">
              <span
                className={`mt-1.5 h-2 w-2 flex-none rounded-full ${
                  status.tone === 'ok' ? 'bg-gold' : status.tone === 'wait' ? 'bg-gold/60' : 'bg-brass'
                }`}
              />
              <div>
                <span className="block text-[15px] font-semibold text-mist">{status.title}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-mist-faint">{status.body}</span>
              </div>
            </div>
            <div className="mt-5 space-y-3 border-t border-navy/[0.08] pt-4">
              {[
                ['Rounds paid', wallet?.totals?.payouts || 0],
                ['Share of the last pot', sharePot ? `${(sharePot * 100).toFixed(3)}%` : '—'],
                ['Minimum to earn', fmtUsd(summary?.launch?.min_holding_usd ?? 10, 0) + ' of XTO'],
              ].map(([label, v]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[13px] text-mist-dim">{label}</span>
                  <span className="font-display text-[14px] font-semibold tabular-nums text-mist">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* transactions, bank-statement style */}
      <div className={`${glass} overflow-hidden`}>
        <div className="flex items-center justify-between px-6 pb-2 pt-5 sm:px-7">
          <h3 className="font-display text-[16px] font-semibold text-mist">Recent payouts</h3>
          <span className="text-[13px] font-medium text-gold-deep">Hourly · Automatic</span>
        </div>
        <div className="divide-y divide-navy/[0.06]">
          {payouts.length === 0 && (
            <div className="px-6 py-8 text-center text-[13px] text-mist-faint sm:px-7">No payouts to this wallet yet.</div>
          )}
          {payouts.map((t) => (
            <a
              key={t.epoch}
              href={t.signature ? `${SOLSCAN}${t.signature}` : undefined}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-navy/[0.03] sm:px-7"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gold/[0.1] text-gold ring-1 ring-gold/[0.25]">
                <OilMark className="h-[18px] w-[18px]" strokeWidth={5} />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-mist">XTO Reward · round {t.epoch}</span>
                <span className="block text-[13px] text-mist-faint">
                  {timeAgo(t.time)} · {fmtNum(t.credited_balance, 0)} XTO credited
                  {t.signature ? ' · view on Solscan ↗' : ''}
                </span>
              </div>
              <div className="text-right">
                <span className="block font-display text-[16px] font-semibold tabular-nums tracking-[-0.01em] text-gold">
                  +{fmtUsd(t.usd || 0, 2)}
                </span>
                <span className="block text-[12px] tabular-nums text-mist-faint">
                  {fmtNum(t.reward, 6)} {symbol}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <p className="max-w-3xl text-xs leading-relaxed text-mist-faint">
        Pace figures apply this wallet&rsquo;s share of the last round to the median hourly pot of
        the past day. They change the moment trading volume does, and are not a promise. Future
        payouts may be higher, lower, or zero.
      </p>
    </div>
  )
}

function LaunchStats({ summary }) {
  const t = summary?.totals
  const symbol = summary?.launch?.reward_symbol || 'USO'
  const items = [
    [`$${symbol} paid to holders`, t ? fmtUsd(t.usd_distributed, 0) : '—'],
    ['Rounds paid', t ? fmtNum(t.epochs_paid, 0) : '—'],
    ['Wallets paid', t ? fmtNum(t.wallets_paid, 0) : '—'],
    ['Holding wallets', t?.holders != null ? fmtNum(t.holders, 0) : '—'],
  ]
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className={`${glass} p-5 text-center`}>
          <span className="block font-display text-[24px] font-semibold tabular-nums tracking-[-0.02em] text-mist">{value}</span>
          <span className="mt-1 block text-[12px] text-mist-faint">{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function PortalPage() {
  const { summary } = useSummary(60_000)
  const [address, setAddress] = useState(() => addressFromHash() || rememberedAddress())
  const [input, setInput] = useState(address)
  const [error, setError] = useState('')
  const [state, setState] = useState({ loading: false, wallet: null, liveBalance: null, found: false, failed: false })

  // follow #/portal/<address> deep links
  useEffect(() => {
    const onHash = () => {
      const a = addressFromHash()
      if (a && a !== address) {
        setAddress(a)
        setInput(a)
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [address])

  // load the wallet's record and live balance whenever the address changes, and again each minute
  useEffect(() => {
    if (!address) return undefined
    let alive = true
    const mint = summary?.launch?.mint
    const load = async () => {
      setState((s) => ({ ...s, loading: true }))
      const [walletRes, balanceRes] = await Promise.allSettled([
        fetchWallet(address),
        mint ? fetchLiveBalance(address, mint) : Promise.reject(new Error('no mint yet')),
      ])
      if (!alive) return
      const wallet = walletRes.status === 'fulfilled' ? walletRes.value : null
      const liveBalance = balanceRes.status === 'fulfilled' ? balanceRes.value : null
      setState({
        loading: false,
        wallet,
        liveBalance,
        found: Boolean(wallet) || (liveBalance ?? 0) > 0,
        failed: walletRes.status === 'rejected' && balanceRes.status === 'rejected',
      })
    }
    load()
    const iv = setInterval(load, 60_000)
    return () => {
      alive = false
      clearInterval(iv)
    }
  }, [address, summary?.launch?.mint])

  const submit = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!SOL_ADDRESS.test(trimmed)) {
      setError('That does not look like a valid Solana address (base58, 32-44 characters).')
      return
    }
    setError('')
    setAddress(trimmed)
    remember(trimmed)
    window.location.hash = `#/portal/${trimmed}`
  }

  const clear = () => {
    setAddress('')
    setInput('')
    remember('')
    setState({ loading: false, wallet: null, liveBalance: null, found: false, failed: false })
    window.location.hash = '#/portal'
  }

  return (
    <div className="relative overflow-hidden bg-paper pt-16">
      <div className="breathe pointer-events-none absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gold-deep/[0.14] blur-[140px]" />

      {/* centered wallet entry */}
      <div className="relative mx-auto max-w-2xl px-6 pb-12 pt-16 text-center sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-6">Holder Portal</p>
          <h1 className="font-serif text-5xl font-semibold leading-[1.06] tracking-[-0.015em] sm:text-6xl">
            Your money, working.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-mist-dim">
            Enter your Solana wallet and check your XTO position like a bank account: balance,
            every payout, and your earning pace. Pin it. Check it daily.
          </p>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-9 max-w-xl"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-0 sm:overflow-hidden sm:rounded-full sm:border sm:border-navy/15 sm:bg-ink-850 sm:shadow-xl sm:shadow-navy/15 sm:focus-within:border-gold/50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Solana wallet address"
              spellCheck="false"
              autoComplete="off"
              className="w-full rounded-full border border-navy/15 bg-ink-850 px-6 py-4 text-center font-mono text-sm text-mist placeholder:text-mist-faint focus:border-gold/50 focus:outline-none sm:rounded-none sm:border-0 sm:bg-transparent"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-full bg-gold px-7 py-4 text-sm font-semibold text-mist transition-colors hover:bg-gold-bright sm:rounded-none sm:py-0"
            >
              Track Wallet
            </button>
          </div>
          {error && <p className="mt-3 text-xs text-brass">{error}</p>}
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-mist-faint">
            Read-only lookup · Never asks you to connect or sign
            {address && (
              <>
                {' · '}
                <button type="button" onClick={clear} className="underline decoration-mist-faint/50 underline-offset-2 hover:text-mist">
                  clear
                </button>
              </>
            )}
          </p>
        </motion.form>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={address || 'launch'}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {!address ? (
              <div className="space-y-5">
                <LaunchStats summary={summary} />
                <p className="text-center text-[13px] text-mist-faint">
                  Figures for the whole launch, from the distribution ledger. Enter a wallet above to see its own.
                </p>
              </div>
            ) : state.loading && !state.wallet && state.liveBalance === null ? (
              <div className="py-16 text-center text-[13px] text-mist-faint">Looking up {address.slice(0, 6)}…{address.slice(-4)}</div>
            ) : state.failed ? (
              <div className={`${glass} px-6 py-10 text-center`}>
                <p className="text-[15px] font-semibold text-mist">Could not reach the ledger</p>
                <p className="mt-2 text-[13px] text-mist-faint">Check your connection and try again in a moment.</p>
              </div>
            ) : !state.found ? (
              <div className="space-y-5">
                <div className={`${glass} px-6 py-10 text-center`}>
                  <p className="text-[15px] font-semibold text-mist">No XTO found in this wallet</p>
                  <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-mist-faint">
                    {address.slice(0, 6)}…{address.slice(-4)} holds no XTO and has never been paid. Hold XTO through a full
                    round and it will appear here after the next payout.
                  </p>
                </div>
                <LaunchStats summary={summary} />
              </div>
            ) : (
              <Dashboard address={address} wallet={state.wallet} liveBalance={state.liveBalance} summary={summary} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
