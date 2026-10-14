import { useEffect, useState } from 'react'

// airdrops go out at minute :26 of every hour, in every timezone alike
export const AIRDROP_MINUTE = 26
// the first minute after :26 is shown as "sending" instead of a 59:xx countdown
const SENDING_WINDOW_S = 60

export function secondsToNextAirdrop(now = Date.now()) {
  const d = new Date(now)
  const target = new Date(d)
  target.setMinutes(AIRDROP_MINUTE, 0, 0)
  if (target <= d) target.setHours(target.getHours() + 1)
  return Math.ceil((target - d) / 1000)
}

export function formatCountdown(s) {
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

// seconds until the next airdrop, ticking once a second
export function useNextAirdrop() {
  const [s, setS] = useState(() => secondsToNextAirdrop())
  useEffect(() => {
    const iv = setInterval(() => setS(secondsToNextAirdrop()), 1000)
    return () => clearInterval(iv)
  }, [])
  return s
}

// "Next airdrop 12:34" pill; shows "Airdrop sending" for the minute after :26
export default function AirdropCountdown({ label = 'Next airdrop', className = '' }) {
  const s = useNextAirdrop()
  const sending = s > 3600 - SENDING_WINDOW_S
  return (
    <span
      className={`inline-flex items-center gap-2.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-mist-faint ${className}`}
      title={`Airdrops send at :${AIRDROP_MINUTE} past every hour`}
    >
      <span className={`h-1.5 w-1.5 rounded-full bg-gold ${sending ? 'animate-ping' : 'animate-pulseSoft'}`} />
      {sending ? (
        <span className="text-gold-deep">Airdrop sending</span>
      ) : (
        <>
          {label}
          <span className="tabular-nums tracking-[0.08em] text-mist">{formatCountdown(s)}</span>
        </>
      )}
    </span>
  )
}
