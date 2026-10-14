import { useEffect, useState } from 'react'
import { nextPayout, useSummary } from '../portalData.js'

// Each epoch runs one hour from the moment it opens, then the runner claims, buys and pays,
// which takes a few minutes; the next epoch opens after that. So the payout clock is read
// from the published summary (current_epoch.closes_at), not from a fixed minute. Until the
// summary has loaded, the previous hour-grid guess (:26) stands in.
export const AIRDROP_MINUTE = 26

function gridGuess(now = Date.now()) {
  const d = new Date(now)
  const target = new Date(d)
  target.setMinutes(AIRDROP_MINUTE, 0, 0)
  if (target <= d) target.setHours(target.getHours() + 1)
  return target.getTime()
}

export function formatCountdown(s) {
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

// { seconds, sending }: seconds until the next payout is due, ticking once a second;
// `sending` while the hour is up and the payouts are going out
export function useNextAirdrop() {
  const { summary } = useSummary(60_000)
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(iv)
  }, [])
  const { at, paying } = nextPayout(summary)
  const target = at ?? (summary ? null : gridGuess(now))
  if (paying || target === null) return { seconds: 0, sending: true }
  return { seconds: Math.max(0, Math.ceil((target - now) / 1000)), sending: false }
}

// "Next airdrop 12:34" pill; shows "Airdrop sending" while the hour's payouts go out
export default function AirdropCountdown({ label = 'Next airdrop', className = '' }) {
  const { seconds, sending } = useNextAirdrop()
  return (
    <span
      className={`inline-flex items-center gap-2.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-mist-faint ${className}`}
      title="Payouts go out once an hour, a few minutes after each epoch closes"
    >
      <span className={`h-1.5 w-1.5 rounded-full bg-gold ${sending ? 'animate-ping' : 'animate-pulseSoft'}`} />
      {sending ? (
        <span className="text-gold-deep">Airdrop sending</span>
      ) : (
        <>
          {label}
          <span className="tabular-nums tracking-[0.08em] text-mist">{formatCountdown(seconds)}</span>
        </>
      )}
    </span>
  )
}
