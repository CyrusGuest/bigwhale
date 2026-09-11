import { motion } from 'framer-motion'

const tiers = [
  {
    name: 'Build',
    price: '$0',
    cadence: 'No commitment',
    blurb: 'Full integration and testing environment. No card required.',
    features: [
      'Unlimited sandbox transactions',
      '100 mainnet payments per month',
      'All 58 corridors in sandbox',
      'Full API and webhooks',
      'Community support',
    ],
    cta: 'Get API Key',
    featured: false,
  },
  {
    name: 'Scale',
    price: '0.25%',
    cadence: 'Of settled volume',
    blurb: 'Production volume, with discounts applied automatically past $1M per month.',
    features: [
      'Unlimited mainnet volume',
      'Volume pricing to 0.10%',
      '30-second guaranteed rate lock',
      '99.9% uptime SLA',
      'Same-day support response',
      'camt.053 / ISO 20022 exports',
    ],
    cta: 'Request Access',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: 'Annual agreement',
    blurb: 'Dedicated liquidity, bespoke corridors, and named engineering support.',
    features: [
      'Dedicated liquidity provisioning',
      'Custom corridor onboarding',
      'SSO / SAML and role-based access',
      '99.99% uptime SLA',
      'Named solutions engineer',
      'On-premise HSM signing option',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="mb-16 max-w-2xl"
      >
        <p className="eyebrow mb-5">Pricing</p>
        <h2 className="font-serif text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
          One number. Fully loaded.
        </h2>
        <p className="mt-5 leading-relaxed text-mist-dim">
          A percentage of settled volume. Network fees pass through at cost;
          foreign exchange is priced into the locked quote. There is no other
          line item.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex flex-col rounded-md p-8 ${
              t.featured
                ? 'border border-brass/50 bg-ink-850'
                : 'panel panel-hover'
            }`}
          >
            {t.featured && (
              <span className="absolute -top-3 left-8 bg-ink-900 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-brass">
                Most common
              </span>
            )}
            <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist-faint">
              {t.name}
            </h3>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-serif text-5xl font-medium tracking-tight">{t.price}</span>
              <span className="text-xs text-mist-faint">{t.cadence}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-mist-dim">{t.blurb}</p>
            <ul className="mt-8 flex-1 space-y-3.5 border-t border-white/[0.07] pt-6">
              {t.features.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-mist-dim">
                  <span className="text-brass">·</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#cta"
              className={`mt-8 text-center ${t.featured ? 'btn-primary' : 'btn-secondary'}`}
            >
              {t.cta}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
