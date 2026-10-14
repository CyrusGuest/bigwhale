import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { formatCountdown } from './AirdropCountdown.jsx'
import { OilMark } from './Hero.jsx'
import { uso } from './Uso.jsx'
import {
  LIVE_STALE_MS,
  PHASES,
  SOL_ADDRESS,
  fetchWallet,
  fmtDateTime,
  fmtNum,
  fmtTime,
  fmtUsd,
  nextPayout,
  timeAgo,
  useLive,
  useNow,
  useSummary,
} from '../portalData.js'

// The next airdrop, as the runner sees it. Two public files feed this page: live.json, which
// the runner rewrites every minute while fees accrue and after every step while a round closes
// (the unclaimed fees come straight from the pool position on-chain), and summary.json, the
// ledger of every completed round. Nothing here connects a wallet or signs anything.

const SOLSCAN = 'https://solscan.io/tx/'
const LAST_ADDRESS_KEY = 'xto-portal-address'
const glass = 'rounded-2xl bg-white ring-1 ring-navy/[0.08] shadow-[0_16px_40px_-28px_rgba(23,23,43,0.28)]'
const EASE = [0.22, 1, 0.36, 1]

function rememberedAddress() {
  try {
    const v = localStorage.getItem(LAST_ADDRESS_KEY) || ''
    return SOL_ADDRESS.test(v) ? v : ''
  } catch {
    return ''
  }
}

const short = (a) => `${a.slice(0, 6)}····${a.slice(-4)}`

// how far through the closing steps the round is: index into PHASES, -1 before, 4 once the next round is opening
function phaseIndex(phase) {
  if (phase === 'opening') return PHASES.length
  if (phase === 'waiting') return 0
  return PHASES.findIndex((p) => p.key === phase)
}

// copy for the big status line while the round is closing
function phaseHeadline(phase, round, symbol) {
  const pot = round?.pot_usdc != null ? fmtUsd(round.pot_usdc, 0) : null
  switch (phase) {
    case 'waiting':
      return `Below the ${fmtUsd(round?.min_pot_usdc ?? 1, 0)} minimum, the round stays open until fees arrive`
    case 'claiming':
      return pot ? `Claiming ${pot} of fees from the pool` : 'Claiming the fees from the pool'
    case 'buying':
      return pot ? `Buying $${symbol} with ${pot}` : `Buying $${symbol} with the claimed fees`
    case 'snapshotting':
      return 'Taking the closing snapshot of every holder'
    case 'distributing':
      return `Sending $${symbol} to eligible wallets`
    case 'opening':
      return 'Opening the next round'
    default:
      return 'Closing the round'
  }
}

function Stepper({ phase }) {
  const idx = phaseIndex(phase)
  return (
    <ol className="grid gap-3 sm:grid-cols-4">
      {PHASES.map((p, i) => {
        const state = i < idx ? 'done' : i === idx ? 'now' : 'next'
        return (
          <li
            key={p.key}
            className={`rounded-xl px-4 py-3.5 ring-1 transition-colors ${
              state === 'now'
                ? 'bg-gold/[0.12] ring-gold/40'
                : state === 'done'
                  ? 'bg-navy/[0.03] ring-navy/[0.06]'
                  : 'bg-white ring-navy/[0.08]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-bold ${
                  state === 'now'
                    ? 'bg-gold text-mist'
                    : state === 'done'
                      ? 'bg-navy/[0.12] text-mist'
                      : 'bg-navy/[0.05] text-mist-faint'
                }`}
              >
                {state === 'done' ? '✓' : i + 1}
              </span>
              <span className={`text-[13px] font-semibold ${state === 'next' ? 'text-mist-faint' : 'text-mist'}`}>{uso(p.label)}</span>
              {state === 'now' && <span className="ml-auto h-1.5 w-1.5 animate-ping rounded-full bg-gold" />}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-mist-faint">{uso(p.body)}</p>
          </li>
        )
      })}
    </ol>
  )
}

function Tile({ label, value, sub, accent = false }) {
  return (
    <div className={`${glass} relative overflow-hidden p-6`}>
      {accent && <div className="breathe pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-gold/[0.18] blur-[60px]" />}
      <span className="relative block text-[13px] font-medium text-mist-faint">{uso(label)}</span>
      <span className="relative mt-1.5 block font-display text-[26px] font-semibold tabular-nums tracking-[-0.02em] text-mist">{value}</span>
      {sub && <span className="relative mt-0.5 block text-[13px] tabular-nums leading-relaxed text-mist-faint">{uso(sub)}</span>}
    </div>
  )
}

// what one wallet stands to receive this round, from its share of the last round's pot
function YourCut({ pot, symbol, rewardPrice, creditedTotal }) {
  const [address, setAddress] = useState(rememberedAddress)
  const [input, setInput] = useState(address)
  const [wallet, setWallet] = useState(undefined) // undefined: loading, null: not found
  const [error, setError] = useState('')

  useEffect(() => {
    if (!address) return undefined
    let alive = true
    setWallet(undefined)
    fetchWallet(address)
      .then((w) => alive && setWallet(w))
      .catch(() => alive && setWallet(null))
    return () => {
      alive = false
    }
  }, [address])

  const submit = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!SOL_ADDRESS.test(trimmed)) {
      setError('That does not look like a valid Solana address.')
      return
    }
    setError('')
    setAddress(trimmed)
    try {
      localStorage.setItem(LAST_ADDRESS_KEY, trimmed)
    } catch {
      /* private mode */
    }
  }

  const share = wallet?.last_epoch?.share_of_pot || 0
  const estUsd = pot != null ? share * pot : null
  const perMillion = pot != null && creditedTotal ? (pot * 1_000_000) / creditedTotal : null
  const paidLast = wallet?.last_epoch?.result === 'paid'

  return (
    <div className={`${glass} p-6 sm:p-7`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-[16px] font-semibold text-mist">Your estimated cut</h3>
        {perMillion != null && (
          <span className="text-[12px] tabular-nums text-mist-faint">
            ≈ {fmtUsd(perMillion, 2)} per 1,000,000 XTO held through the round
          </span>
        )}
      </div>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Solana wallet address"
          spellCheck="false"
          autoComplete="off"
          className="w-full rounded-full border border-navy/15 bg-ink-850 px-5 py-3 font-mono text-[13px] text-mist placeholder:text-mist-faint focus:border-gold/50 focus:outline-none"
        />
        <button type="submit" className="whitespace-nowrap rounded-full bg-gold px-6 py-3 text-[13px] font-semibold text-mist transition-colors hover:bg-gold-bright">
          Estimate
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-brass">{error}</p>}

      {address && (
        <div className="mt-5 border-t border-navy/[0.08] pt-5">
          {wallet === undefined ? (
            <p className="text-[13px] text-mist-faint">Looking up {short(address)}…</p>
          ) : !wallet || !paidLast ? (
            <div>
              <p className="text-[15px] font-semibold text-mist">{short(address)} was not paid in the last round</p>
              <p className="mt-1 text-[13px] leading-relaxed text-mist-faint">
                A wallet earns once it has held XTO through a full round. Its first payout sets its share; check back after the next one, or see its
                history in the{' '}
                <a href={`#/portal/${address}`} className="underline decoration-gold decoration-2 underline-offset-4">
                  Holder Portal
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="block text-[13px] text-mist-faint">{short(address)} · {(share * 100).toFixed(3)}% of the last pot</span>
                <span className="mt-1 block font-display text-[32px] font-semibold tabular-nums tracking-[-0.02em] text-gold">
                  {estUsd != null ? `≈ ${fmtUsd(estUsd, 2)}` : '—'}
                </span>
                <span className="block text-[13px] text-mist-faint">
                  {uso(estUsd != null && rewardPrice ? `about ${fmtNum(estUsd / rewardPrice, 6)} $${symbol} this round, if the share holds` : `of $${symbol} this round`)}
                </span>
              </div>
              <a href={`#/portal/${address}`} className="btn-secondary !px-5 !py-2.5 text-[12px]">
                Full history →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LastRound({ last, symbol }) {
  if (!last) return null
  const rows = [
    ['Fees claimed', last.usdc_claimed != null ? `${fmtUsd(last.usdc_claimed)} USDC` : '—', last.claim_signature],
    [`$${symbol} bought`, last.reward_bought != null ? `${fmtNum(last.reward_bought, 6)} @ ${fmtUsd(last.reward_price_usd || 0)}` : '—', last.buy_signature],
    ['Wallets paid', `${fmtNum(last.paid, 0)} of ${fmtNum(last.eligible, 0)} eligible`, null],
    ['Holding wallets at the snapshot', last.holders != null ? fmtNum(last.holders, 0) : '—', null],
  ]
  return (
    <div className={`${glass} p-6 sm:p-7`}>
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-[16px] font-semibold text-mist">Last round · #{last.id}</h3>
        <span className="text-[12px] text-mist-faint">paid {timeAgo(last.paid_at)}</span>
      </div>
      <div className="mt-2 font-display text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-mist">
        {last.usd_paid != null ? fmtUsd(last.usd_paid, 0) : '—'}
        <span className="ml-2 text-[14px] font-medium text-mist-faint">{uso(`of $${symbol} sent out`)}</span>
      </div>
      <div className="mt-4 space-y-2.5 border-t border-navy/[0.08] pt-4">
        {rows.map(([label, value, sig]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-mist-dim">{uso(label)}</span>
            <span className="text-right font-display text-[13px] font-semibold tabular-nums text-mist">
              {value}
              {sig && (
                <a href={`${SOLSCAN}${sig}`} target="_blank" rel="noreferrer" className="ml-2 font-normal text-gold-deep hover:underline">
                  tx ↗
                </a>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentRounds({ epochs, symbol }) {
  const rows = (epochs || []).filter((e) => e.state === 'DONE').slice(0, 12)
  if (rows.length === 0) return null
  return (
    <div className={`${glass} overflow-hidden`}>
      <div className="flex items-center justify-between px-6 pb-2 pt-5 sm:px-7">
        <h3 className="font-display text-[16px] font-semibold text-mist">Recent rounds</h3>
        <span className="text-[13px] font-medium text-gold-deep">Hourly · Automatic</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.12em] text-mist-faint">
              <th className="px-6 py-2 font-medium sm:px-7">Round</th>
              <th className="px-3 py-2 font-medium">Closed</th>
              <th className="px-3 py-2 text-right font-medium">Fees claimed</th>
              <th className="px-3 py-2 text-right font-medium">{uso(`$${symbol} bought`)}</th>
              <th className="px-3 py-2 text-right font-medium">Wallets paid</th>
              <th className="px-6 py-2 text-right font-medium sm:px-7">Sent out</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/[0.06]">
            {rows.map((e) => (
              <tr key={e.id} className="tabular-nums">
                <td className="px-6 py-3 font-semibold text-mist sm:px-7">#{e.id}</td>
                <td className="px-3 py-3 text-mist-dim">{e.closed_at ? fmtDateTime(e.closed_at) : '—'}</td>
                <td className="px-3 py-3 text-right text-mist">{e.usdc_claimed != null ? fmtUsd(e.usdc_claimed) : '—'}</td>
                <td className="px-3 py-3 text-right text-mist">{e.reward_bought != null ? fmtNum(e.reward_bought, 4) : '—'}</td>
                <td className="px-3 py-3 text-right text-mist">{fmtNum(e.paid, 0)}</td>
                <td className="px-6 py-3 text-right font-semibold text-gold sm:px-7">
                  {e.usd_paid != null ? fmtUsd(e.usd_paid, 0) : '—'}
                  {e.buy_signature && (
                    <a href={`${SOLSCAN}${e.buy_signature}`} target="_blank" rel="noreferrer" className="ml-2 font-normal text-gold-deep hover:underline">
                      ↗
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AirdropPage() {
  const { summary } = useSummary(60_000)
  const { live } = useLive(15_000)
  const now = useNow(1000)

  const symbol = summary?.launch?.reward_symbol || live?.reward_symbol || 'USOon'
  const { at, phase, paying, round: roundId } = nextPayout(summary, live, now)
  const loaded = Boolean(summary || live)
  const stale = live ? now - Date.parse(live.generated_at) > LIVE_STALE_MS : false
  const round = live?.round
  const fees = live?.fees
  const last = live?.last_round

  const seconds = at ? Math.max(0, Math.ceil((at - now) / 1000)) : 0
  const sinceDue = at && paying ? now - at : 0
  const buyingLong = phase === 'buying' && sinceDue > 10 * 60_000

  // the pot: what is claimable right now plus the carry, or the recorded pot once claimed
  const pot = round?.pot_usdc ?? null
  const rewardPrice = round?.reward_price_usd ?? summary?.totals?.reward_price_usd ?? null
  const perHour = fees?.unclaimed_per_hour ?? fees?.claimed_per_hour_24h ?? null
  const perHourIsRound = fees?.unclaimed_per_hour != null
  const openedAgoMin = round ? Math.max(0, Math.round((now - Date.parse(round.opened_at)) / 60_000)) : null

  const tiles = useMemo(
    () => [
      {
        label: 'Unclaimed fees right now',
        value: fees?.unclaimed_usdc != null ? fmtUsd(fees.unclaimed_usdc) : '—',
        sub:
          round?.carried_usdc > 0
            ? `USDC sitting in the pool · plus ${fmtUsd(round.carried_usdc)} carried from the last round`
            : 'USDC swap fees sitting in the XTO pool, claimed when the round closes',
        accent: true,
      },
      {
        label: round?.pot_is_estimate === false ? "This round's pot" : "This round's pot (so far)",
        value: pot != null ? fmtUsd(pot) : '—',
        sub:
          round?.reward_bought != null
            ? `bought ${fmtNum(round.reward_bought, 6)} $${symbol} @ ${fmtUsd(round.reward_price_usd || 0)}`
            : round?.est_reward != null
              ? `≈ ${fmtNum(round.est_reward, 4)} $${symbol} at the last buy price (${fmtUsd(rewardPrice || 0)})`
              : `buys $${symbol} when the round closes`,
      },
      {
        label: 'Fees per hour',
        value: perHour != null ? fmtUsd(perHour, 0) : '—',
        sub: perHour == null ? 'shown a few minutes into the round' : perHourIsRound ? `this round's pace, ${openedAgoMin} min in` : 'average over the last 24 hours',
      },
      {
        label: 'Eligible wallets',
        value: last ? fmtNum(last.eligible, 0) : '—',
        sub: last?.holders != null ? `of ${fmtNum(last.holders, 0)} holding wallets at the last snapshot` : 'wallets paid in the last round',
      },
    ],
    [fees, round, pot, symbol, rewardPrice, perHour, perHourIsRound, openedAgoMin, last],
  )

  return (
    <div className="relative overflow-hidden bg-paper pt-16">
      <div className="breathe pointer-events-none absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gold-deep/[0.14] blur-[140px]" />

      {/* the clock */}
      <div className="relative mx-auto max-w-3xl px-6 pb-10 pt-16 text-center sm:pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
          <p className="eyebrow mb-6 justify-center">
            <OilMark className="h-3.5 w-3.5" strokeWidth={5} />
            {roundId ? `Round ${roundId}` : 'Next airdrop'}
          </p>
          {!loaded ? (
            <div className="font-display text-7xl font-semibold tabular-nums tracking-[-0.03em] text-mist-faint sm:text-8xl">--:--</div>
          ) : paying ? (
            <>
              <div className="inline-flex items-center gap-3 rounded-full bg-gold/[0.12] px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-gold ring-1 ring-gold/30">
                <span className="h-2 w-2 animate-ping rounded-full bg-gold" />
                {phase === 'waiting' ? 'Round held open' : 'Closing now'}
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.1] tracking-[-0.015em] sm:text-5xl">{uso(phaseHeadline(phase, round, symbol))}</h1>
              <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-mist-dim">
                {phase === 'waiting'
                  ? 'Too little was earned this hour to be worth a round. It closes the moment the fees reach the minimum.'
                  : buyingLong
                    ? uso(
                        `The market maker that sells $${symbol} quotes mainly during US market hours. Outside them the buy waits for a price within the cap, and the payout follows the moment it fills. The fees are already claimed and safe in the rewards wallet.`,
                      )
                    : 'The hour is up. The whole close usually takes two to three minutes, and the next round starts the moment the last payout lands.'}
              </p>
            </>
          ) : (
            <>
              <div className="font-display text-7xl font-semibold tabular-nums tracking-[-0.03em] text-mist sm:text-8xl">{formatCountdown(seconds)}</div>
              <p className="mt-5 text-[15px] leading-relaxed text-mist-dim">
                {uso(`Round ${roundId} closes at ${fmtTime(at)}. The fees are claimed, $${symbol} is bought and payouts land a couple of minutes later.`)}
              </p>
              <p className="mt-2 text-[12px] text-mist-faint">
                Rounds last one hour from the moment the previous one finishes paying, so the close drifts a little later each time.
              </p>
            </>
          )}
          {stale && (
            <p className="mt-5 inline-block rounded-full bg-brass/10 px-4 py-1.5 text-[12px] font-medium text-brass">
              The runner last reported {timeAgo(live.generated_at, now)}. The figures below may lag.
            </p>
          )}
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-6xl space-y-5 px-6 pb-24">
        {paying && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <Stepper phase={phase} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {tiles.map((t) => (
            <Tile key={t.label} {...t} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="grid gap-5 lg:grid-cols-3"
        >
          <div className="lg:col-span-2">
            <YourCut pot={pot} symbol={symbol} rewardPrice={rewardPrice} creditedTotal={last?.credited_total} />
          </div>
          <LastRound last={last} symbol={symbol} />
        </motion.div>

        {!paying && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className={`${glass} p-6 sm:p-7`}
          >
            <h3 className="font-display text-[16px] font-semibold text-mist">What happens when the clock hits zero</h3>
            <div className="mt-4">
              <Stepper phase="accruing" />
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-mist-faint">
              {uso(
                `To be paid, a wallet must hold at least ${fmtUsd(summary?.launch?.min_holding_usd ?? 10, 0)} of XTO through the whole round. It is credited with the lower of its balance at the round's start and end, so buying mid-round earns from the next one. Team, pool and treasury wallets never earn.`,
              )}
            </p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35, ease: EASE }}>
          <RecentRounds epochs={summary?.epochs} symbol={symbol} />
        </motion.div>

        <p className="max-w-3xl text-xs leading-relaxed text-mist-faint">
          Unclaimed fees are read from the pool position on-chain and refresh about once a minute. The pot and the per-wallet
          estimate assume the fees claimed at the close match what is shown now and that shares stay as they were in the last
          round; both move with trading. None of this is a promise. Future payouts may be higher, lower, or zero.
        </p>
      </div>
    </div>
  )
}
