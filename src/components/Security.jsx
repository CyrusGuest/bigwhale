import { motion } from 'framer-motion'

const items = [
  {
    title: 'HSM-backed key custody',
    body: 'Signing keys reside in FIPS 140-2 Level 3 hardware security modules. Mainnet transactions require multi-party approval; no single individual can move funds unilaterally.',
  },
  {
    title: 'SOC 2 Type II',
    body: 'Annual third-party audits of security, availability, and confidentiality controls. The current report is available under NDA through the trust portal.',
  },
  {
    title: 'Sanctions and AML screening',
    body: 'Every counterparty is screened against OFAC, UN, and EU consolidated lists at quote time and again at settlement. Travel Rule data exchange is integrated into corridor payouts.',
  },
  {
    title: 'Licensed money movement',
    body: 'Fiat legs are executed through licensed partners in each jurisdiction — money transmitter coverage in the US, EMI partners in the UK and EEA, and regulated PSPs across APAC corridors.',
  },
  {
    title: 'No chargeback exposure',
    body: 'Ledger finality removes the friendly-fraud loss category that card merchants price into their margins. Refunds are issued as new, explicit payments under your control.',
  },
  {
    title: 'Public bug bounty',
    body: 'Standing rewards up to $50,000 for critical findings on api.xrpay.io and the signing infrastructure. Scope and safe-harbor terms are published at /security.',
  },
]

export default function Security() {
  return (
    <section id="security" className="border-t border-white/[0.07] bg-ink-850/40">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-2xl"
        >
          <p className="eyebrow mb-5">Security &amp; Compliance</p>
          <h2 className="font-serif text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
            Controls designed for diligence.
          </h2>
          <p className="mt-5 leading-relaxed text-mist-dim">
            Moving institutional funds is a trust mandate. These are the
            controls behind ours.
          </p>
        </motion.div>

        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
              className="border-t border-brass/30 pt-5"
            >
              <h3 className="font-medium tracking-tight">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-mist-dim">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
