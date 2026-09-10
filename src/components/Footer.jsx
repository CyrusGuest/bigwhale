const columns = [
  {
    title: 'Token',
    links: ['Mechanism', 'Design Principles', 'Distribution History', 'Tokenomics Paper'],
  },
  {
    title: 'Verify',
    links: ['Rewards Pool Address', 'XRPL Explorer', 'Fee Collection Records', 'Supply Attestation'],
  },
  {
    title: 'Legal',
    links: ['Risk Disclosure', 'Terms of Use', 'Privacy Policy', 'Jurisdiction Notices'],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-ink-850/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center border border-brass/60 font-serif text-sm font-medium text-mist">
              X
            </span>
            <span className="text-base font-medium tracking-[0.08em]">XRPAY</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist-dim">
            Virtual mining on the XRP Ledger: trading fees redistributed to
            holders in XRP — pro-rata, hourly, and publicly verifiable.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex max-w-sm overflow-hidden rounded-sm border border-white/10 focus-within:border-white/25"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full bg-ink-900 px-4 py-3 text-[13px] text-mist placeholder:text-mist-faint focus:outline-none"
            />
            <button
              type="submit"
              className="whitespace-nowrap bg-mist px-5 text-[12px] font-medium text-ink-950 transition-colors hover:bg-white"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-2 text-[11px] text-mist-faint">
            Mechanism changes and distribution reports. Never price talk.
          </p>

          <div className="mt-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-mist-faint">
            <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-azure" />
            Distributions operating normally
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-5 font-mono text-[10px] uppercase tracking-[0.24em] text-mist-faint">
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-mist-dim transition-colors hover:text-mist">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.07] px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <p className="mx-auto max-w-4xl text-center text-[11px] leading-relaxed text-mist-faint">
            XRPVM is a speculative digital asset, not an investment product,
            deposit, or income scheme. Distributions are funded solely by
            trading fees, vary with volume, and may be zero for any period.
            Past distributions do not predict future ones. The token’s market
            price can decline regardless of rewards received, and you may lose
            your entire outlay. XRP cannot be mined; XRPVM does not mine,
            generate, or create XRP. The project reserve is a treasury, not
            redemption backing. Nothing on this site is financial advice.
          </p>
          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint">
            © {new Date().getFullYear()} XRPAY
          </p>
        </div>
      </div>
    </footer>
  )
}
