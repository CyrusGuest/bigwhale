import { useEffect, useState } from 'react'

// Static JSON published by the rewards runner after every epoch (see xstock-rewards,
// src/portal/export.ts): summary.json for the launch, wallets/<address>.json per holder.
export const DATA_URL = (import.meta.env.VITE_PORTAL_DATA_URL || 'https://d24y7a3g5u04xu.cloudfront.net').replace(/\/$/, '')

// Public Solana RPC, read-only, used for one thing: the wallet's live token balance.
export const RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'

export const SOL_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

const SUMMARY_TTL_MS = 30_000
let summaryCache = { at: 0, promise: null }

export function fetchSummary(force = false) {
  const now = Date.now()
  if (!force && summaryCache.promise && now - summaryCache.at < SUMMARY_TTL_MS) return summaryCache.promise
  const promise = fetch(`${DATA_URL}/summary.json`, { cache: 'no-cache' }).then((r) => {
    if (!r.ok) throw new Error(`summary ${r.status}`)
    return r.json()
  })
  summaryCache = { at: now, promise }
  promise.catch(() => {
    summaryCache = { at: 0, promise: null }
  })
  return promise
}

// The launch summary, refreshed every `everyMs` while mounted. `null` until the first load,
// `undefined` never: an error leaves the last good value in place.
export function useSummary(everyMs = 60_000) {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    let alive = true
    const load = () =>
      fetchSummary()
        .then((s) => {
          if (!alive) return
          setSummary(s)
          setError(null)
        })
        .catch((e) => alive && setError(e))
    load()
    const iv = setInterval(load, everyMs)
    return () => {
      alive = false
      clearInterval(iv)
    }
  }, [everyMs])
  return { summary, error }
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

// When the next payout is expected, from the current epoch's timing. `paying` is true from
// the moment the hour is up until the payouts have gone out.
export function nextPayout(summary) {
  const cur = summary?.current_epoch
  if (!cur) return { at: null, paying: false }
  if (cur.paying) return { at: null, paying: true }
  if (!cur.closes_at) return { at: null, paying: false }
  const at = Date.parse(cur.closes_at)
  return { at, paying: at <= Date.now() }
}

export const fmtUsd = (n, d = 2) =>
  (n ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: d, maximumFractionDigits: d })
export const fmtNum = (n, d = 2) =>
  (n ?? 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

export function timeAgo(iso, now = Date.now()) {
  const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1000))
  if (s < 60) return 'Just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 48) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}
