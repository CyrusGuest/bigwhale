import { PHASE_SHORT, nextPayout, useLive, useNow, useSummary } from '../portalData.js'

// Each round runs one hour from the moment it opens; when the hour is up the runner claims the
// fees, buys $USOon, snapshots the holders and pays, which takes a few minutes, and the next
// round opens after that. So the clock is read from what the runner publishes (live.json every
// minute, summary.json after every round), never from a fixed minute of the hour: each round
// starts a little later than the last.

export function formatCountdown(s) {
  const h = Math.floor(s / 3600)
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

// { seconds, sending, phase, label, loaded, round }: seconds until the round is due to close,
// ticking once a second; `sending` from the moment the hour is up until the next round has
// opened, with `phase` saying which step the runner is on and `label` a short name for it
export function useNextAirdrop() {
  const { summary } = useSummary(60_000)
  const { live } = useLive(15_000)
  const now = useNow(1000)
  const { at, phase, paying, round } = nextPayout(summary, live, now)
  const loaded = Boolean(summary || live)
  if (!loaded) return { seconds: 0, sending: false, phase: null, label: 'Next airdrop', loaded, round: null }
  if (paying || at === null) return { seconds: 0, sending: true, phase, label: PHASE_SHORT[phase] || 'Airdrop sending', loaded, round }
  return { seconds: Math.max(0, Math.ceil((at - now) / 1000)), sending: false, phase: 'accruing', label: 'Next airdrop', loaded, round }
}

// "Next airdrop 12:34" pill, linking to the airdrop page; names the step while a round closes
export default function AirdropCountdown({ label = 'Next airdrop', className = '' }) {
  const { seconds, sending, label: phaseLabel, loaded } = useNextAirdrop()
  return (
    <a
      href="#/airdrop"
      className={`inline-flex items-center gap-2.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-mist-faint transition-colors hover:text-mist ${className}`}
      title="Payouts go out once an hour, a few minutes after each round closes. Tap for the next airdrop."
    >
      <span className={`h-1.5 w-1.5 rounded-full bg-gold ${sending ? 'animate-ping' : 'animate-pulseSoft'}`} />
      {sending ? (
        <span className="text-gold-deep">{phaseLabel}</span>
      ) : (
        <>
          {label}
          <span className="tabular-nums tracking-[0.08em] text-mist">{loaded ? formatCountdown(seconds) : '--:--'}</span>
        </>
      )}
    </a>
  )
}
