import { useState } from 'react'

export const CONTRACT_ADDRESS = 'XtogpWjiAgvkemc5gr1auxkh77w3vKgSQN1nxJeJfHt'

// the token's mint address as a copy-to-clipboard pill; shown wherever the
// site asks people to buy so the address they paste is always the real one
export default function ContractAddress({ className = '' }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable: the address is still selectable text */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      title="Copy contract address"
      className={`group inline-flex max-w-full items-center gap-3 rounded-sm border border-navy/20 bg-paper/60 px-4 py-2.5 text-left font-mono text-[11px] tracking-[0.04em] text-mist-dim transition-colors hover:border-gold/50 hover:text-mist ${className}`}
    >
      <span className="flex-none text-[10px] uppercase tracking-[0.22em] text-gold-deep">CA</span>
      <span className="break-all select-all">{CONTRACT_ADDRESS}</span>
      <span className="flex-none text-[10px] uppercase tracking-[0.18em] text-mist-faint transition-colors group-hover:text-gold-deep">
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  )
}
