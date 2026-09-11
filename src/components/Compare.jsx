import { motion } from 'framer-motion'

const rows = [
  { label: 'Settlement time', xrpay: '3–5 seconds', swift: '1–5 business days', cards: 'Instant auth, T+2 payout' },
  { label: 'Cost on a $1,000 transfer', xrpay: '$2.50 + $0.0002 network', swift: '$25–$50 + FX markup', cards: '$29.30 (2.9% + $0.30)' },
  { label: 'Operating hours', xrpay: 'Continuous', swift: 'Banking hours, business days', cards: '24/7 auth, batch settlement' },
  { label: 'Reversibility', xrpay: 'Final at ledger close', swift: 'Recallable for days', cards: 'Chargebacks up to 120 days' },
  { label: 'Intermediaries', xrpay: 'One ledger', swift: '4–6 correspondent banks', cards: 'Issuer, network, acquirer, processor' },
  { label: 'Traceability', xrpay: 'Public ledger, independently verifiable', swift: 'Opaque; trace requests take days', cards: 'Closed network reporting' },
  { label: 'FX transparency', xrpay: 'Rate locked at quote, all-in', swift: 'Spread set by each intermediary', cards: 'Network rate + issuer markup' },
]

export default function Compare() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="mb-14 max-w-2xl"
      >
        <p className="eyebrow mb-5">Comparison</p>
        <h2 className="font-serif text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
          A basis for comparison.
        </h2>
        <p className="mt-5 leading-relaxed text-mist-dim">
          Measured against the two rails most institutions rely on today.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="overflow-x-auto rounded-md border border-white/[0.08]"
      >
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-ink-800/80">
              <th className="px-6 py-5"> </th>
              <th className="px-6 py-5 text-[13px] font-semibold text-mist">XPY</th>
              <th className="px-6 py-5 text-[13px] font-medium text-mist-faint">SWIFT wire</th>
              <th className="px-6 py-5 text-[13px] font-medium text-mist-faint">Card networks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-white/[0.05] last:border-0">
                <td className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-mist-faint">
                  {r.label}
                </td>
                <td className="border-x border-white/[0.06] bg-azure-deep/[0.10] px-6 py-4 font-medium text-mist">
                  {r.xrpay}
                </td>
                <td className="px-6 py-4 text-mist-dim">{r.swift}</td>
                <td className="px-6 py-4 text-mist-dim">{r.cards}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <p className="mt-5 font-mono text-[11px] text-mist-faint">
        XPY cost shown at the Scale tier (0.25% of settled volume). Card figure reflects standard 2.9% + $0.30 online processing.
      </p>
    </section>
  )
}
