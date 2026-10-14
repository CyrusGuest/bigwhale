import ContractAddress from './ContractAddress.jsx'
import AirdropCountdown from './AirdropCountdown.jsx'

const columns = [
  {
    title: 'Site',
    links: [
      ['How It Works', '#how'],
      ['Why Oil', '#oil'],
      ['Holder Portal', '#/portal'],
      ['FAQ', '#faq'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Risk Disclosure', '#/legal/risk'],
      ['Terms of Use', '#/legal/terms'],
      ['Privacy Policy', '#/legal/privacy'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-navy/[0.07] bg-ink-850">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <img src="/logo-xto.png" alt="XTO" width={1000} height={380} className="h-7 w-auto" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist-dim">
            Virtual drilling on a public ledger: trading fees redistributed to
            holders in $USO, split by holdings, hourly, and publicly verifiable.
          </p>
          <ContractAddress className="mt-6" />

          <div className="mt-8 flex flex-col gap-2">
            <AirdropCountdown />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mist-faint">
              Airdrops send at :26 past every hour
            </span>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-5 font-mono text-[10px] uppercase tracking-[0.24em] text-mist-faint">
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-sm text-mist-dim transition-colors hover:text-mist">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-navy/[0.07] px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <p className="mx-auto max-w-4xl text-center text-[11px] leading-relaxed text-mist-faint">
            XTO is a speculative digital asset, not an investment product,
            deposit, or income scheme. Distributions are funded solely by
            trading fees, vary with volume, and may be zero for any period.
            Past distributions do not predict future ones. The token’s market
            price can decline regardless of rewards received, and you may lose
            your entire outlay. XTO owns no wells and drills nothing; it does
            not produce, generate, or create oil. The project reserve is a treasury, not
            redemption backing. Nothing on this site is financial advice.
          </p>
          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint">
            © {new Date().getFullYear()} XTO
          </p>
        </div>
      </div>
    </footer>
  )
}
