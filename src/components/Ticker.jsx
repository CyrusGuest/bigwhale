const metrics = [
  ['Trading fee', '5%'],
  ['Holder share', '4% of trade'],
  ['Liquidity share', '1% of trade'],
  ['Cadence', 'Hourly'],
  ['Paid in', 'XRP'],
  ['Claiming required', 'None'],
]

export default function Ticker() {
  return (
    <div className="border-y border-white/[0.07] bg-ink-850/70">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/[0.06] px-6 sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map(([label, value]) => (
          <div key={label} className="px-5 py-5 first:pl-0">
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint">
              {label}
            </span>
            <span className="mt-1 block text-sm font-medium text-mist">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
