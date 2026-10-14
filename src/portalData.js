import { useEffect, useState } from 'react'

// Static JSON published by the rewards runner (see xstock-rewards, src/portal/export.ts and
// src/portal/live.ts): summary.json for the launch and its rounds, wallets/<address>.json per
// holder, and live.json for the round in progress (refreshed every runner pass, about once a
// minute, and after every step while a round is closing).
export const DATA_URL = (import.meta.env.VITE_PORTAL_DATA_URL || 'https://d24y7a3g5u04xu.cloudfront.net').replace(/\/$/, '')

// Public Solana RPC, read-only, used for one thing: the wallet's live token balance.
export const RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'

export const SOL_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

// one in-flight/recent promise per file, so every component on the page shares a fetch
function cachedFetcher(path, ttlMs) {
  let cache = { at: 0, promise: null }
  return (force = false) => {
    const now = Date.now()
    if (!force && cache.promise && now - cache.at < ttlMs) return cache.promise
    const promise = fetch(`${DATA_URL}/${path}`, { cache: 'no-cache' }).then((r) => {
      if (!r.ok) throw new Error(`${path} ${r.status}`)
      return r.json()
    })
    cache = { at: now, promise }
    promise.catch(() => {
      cache = { at: 0, promise: null }
    })
    return promise
  }
}

export const fetchSummary = cachedFetcher('summary.json', 30_000)
export const fetchLive = cachedFetcher('live.json', 8_000)

// poll `fetcher` every `everyMs` while mounted. `null` until the first load; an error leaves
// the last good value in place and is reported separately.
function usePolled(fetcher, everyMs) {
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    let alive = true
    const load = () =>
      fetcher()
        .then((v) => {
          if (!alive) return
          setValue(v)
          setError(null)
        })
        .catch((e) => alive && setError(e))
    load()
    const iv = setInterval(load, everyMs)
    const onVisible = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      alive = false
      clearInterval(iv)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [fetcher, everyMs])
  return { value, error }
}

// The launch summary (rounds, totals), refreshed every `everyMs` while mounted.
export function useSummary(everyMs = 60_000) {
  const { value, error } = usePolled(fetchSummary, everyMs)
  return { summary: value, error }
}

// The round in progress: phase, due time, the pot, the fees unclaimed in the pool right now.
export function useLive(everyMs = 15_000) {
  const { value, error } = usePolled(fetchLive, everyMs)
  return { live: value, error }
}

// the wall clock, re-rendered once a second
export function useNow(everyMs = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), everyMs)
    return () => clearInterval(iv)
  }, [everyMs])
  return now
}

// One wallet's published record, or `null` when the wallet has never held the token at a
// snapshot nor been paid (the file does not exist).
export async function fetchWallet(address) {
  const r = await fetch(`${DATA_URL}/wallets/${address}.json`, { cache: 'no-cache' })
  if (r.status === 404 || r.status === 403) return null
  if (!r.ok) throw new Error(`wallet ${r.status}`)
  return r.json()
}

// Live balance of `mint` held by `owner`, in whole tokens, straight from the chain.
export async function fetchLiveBalance(owner, mint) {
  const r = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccountsByOwner',
      params: [owner, { mint }, { encoding: 'jsonParsed', commitment: 'confirmed' }],
    }),
  })
  if (!r.ok) throw new Error(`rpc ${r.status}`)
  const body = await r.json()
  if (body.error) throw new Error(body.error.message || 'rpc error')
  return body.result.value.reduce((sum, a) => sum + (a.account.data.parsed.info.tokenAmount.uiAmount || 0), 0)
}

// The runner's picture is considered stale when it has not been refreshed for this long: the
// run loop normally rewrites live.json every minute.
export const LIVE_STALE_MS = 10 * 60_000

// What each phase of a closing round means, in order. `accruing` is the hour itself.
export const PHASES = [
  { key: 'claiming', label: 'Claiming fees', short: 'Claiming fees', body: 'The USDC swap fees earned this round are claimed from the XTO pool.' },
  { key: 'buying', label: 'Buying $USO', short: 'Buying $USO', body: 'The claimed USDC buys $USOon at the best of two prices: the market maker or the team pool, never more than a small premium over the reference price.' },
  { key: 'snapshotting', label: 'Snapshot', short: 'Snapshot', body: 'Every holder is counted. A wallet is credited with the lower of its balance at the start and at the end of the round.' },
  { key: 'distributing', label: 'Sending payouts', short: 'Airdrop sending', body: '$USOon is sent to every eligible wallet, pro-rata, in batches. Nothing to claim.' },
]

export const PHASE_SHORT = {
  accruing: 'Next airdrop',
  waiting: 'Waiting for fees',
  claiming: 'Claiming fees',
  buying: 'Buying $USO',
  snapshotting: 'Snapshot',
  distributing: 'Airdrop sending',
  opening: 'Opening round',
}

// Where the next payout stands, from live.json when it is fresh and from summary.json
// otherwise. `at` is when the round is due to close (ms); `phase` is 'accruing' while the hour
// runs, then the closing steps; `paying` is true from the moment the hour is up until the next
// round has opened.
export function nextPayout(summary, live, now = Date.now()) {
  const fresh = live?.round && now - Date.parse(live.generated_at) < LIVE_STALE_MS
  if (fresh) {
    const r = live.round
    const at = Date.parse(r.due_at)
    const phase = r.phase === 'accruing' && at <= now ? 'claiming' : r.phase
    return { at, phase, paying: phase !== 'accruing', round: r.id, stale: false }
  }
  const cur = summary?.current_epoch
  if (!cur) return { at: null, phase: null, paying: false, round: null, stale: Boolean(live) }
  if (cur.paying) return { at: null, phase: 'distributing', paying: true, round: cur.id, stale: Boolean(live) }
  if (!cur.closes_at) return { at: null, phase: 'opening', paying: true, round: cur.id, stale: Boolean(live) }
  const at = Date.parse(cur.closes_at)
  const due = at <= now
  return { at, phase: due ? 'claiming' : 'accruing', paying: due, round: cur.id, stale: Boolean(live) }
}

export const fmtUsd = (n, d = 2) =>
  (n ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: d, maximumFractionDigits: d })
export const fmtNum = (n, d = 2) =>
  (n ?? 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

export const fmtTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
export const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

export function timeAgo(iso, now = Date.now()) {
  const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1000))
  if (s < 60) return 'Just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 48) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}
