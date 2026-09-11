import { motion } from 'framer-motion'

const codeLines = [
  { c: 'text-mist-faint', t: '// settle a cross-border payment' },
  { c: '', t: '' },
  { c: 'text-azure', t: "import { XRPay } from '@xrpay/sdk'" },
  { c: '', t: '' },
  { c: 'text-mist', t: 'const xrpay = new XRPay({ apiKey: process.env.XPY_KEY })' },
  { c: '', t: '' },
  { c: 'text-mist', t: 'const tx = await xrpay.payments.create({' },
  { c: 'text-mist-dim', t: "  from:   { currency: 'USD', amount: '2500.00' }," },
  { c: 'text-mist-dim', t: "  to:     { currency: 'EUR', wallet: 'rN7n...4hK2' }," },
  { c: 'text-mist-dim', t: "  memo:   'invoice-8841'," },
  { c: 'text-mist', t: '})' },
  { c: '', t: '' },
  { c: 'text-brass', t: "console.log(tx.status)  // 'settled', 3.1s later" },
]

const endpoints = [
  { method: 'POST', path: '/v1/quotes', desc: 'Lock an all-in FX rate for 30s' },
  { method: 'POST', path: '/v1/payments', desc: 'Create an idempotent payment from a quote' },
  { method: 'GET', path: '/v1/payments/:id', desc: 'Status: created → funded → settled' },
  { method: 'GET', path: '/v1/corridors', desc: 'Live corridors, payout methods, limits' },
  { method: 'POST', path: '/v1/escrows', desc: 'Time- or condition-locked disbursements' },
  { method: 'POST', path: '/v1/batches', desc: 'Up to 8 payouts in one atomic transaction' },
]

const perks = [
  {
    title: 'One SDK, every corridor',
    body: 'TypeScript, Python, Go, and Rust clients with a single unified API surface. Sandbox to mainnet with one configuration change.',
  },
  {
    title: 'Webhooks bound to finality',
    body: 'Events fire on validated ledger close, not on optimistic estimates. A settled event means the value has moved.',
  },
  {
    title: 'Idempotent by default',
    body: 'Retry any request at any time. Duplicate-safe payment creation means transient network failures never produce a double payment.',
  },
]

export default function DevSection() {
  return (
    <section id="developers" className="border-y border-white/[0.07] bg-ink-850/40">
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow mb-5">Developers</p>
            <h2 className="font-serif text-4xl font-medium tracking-[-0.01em] sm:text-5xl">
              Integration measured in days, not quarters.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-mist-dim">
              Seven lines of code between your systems and global settlement.
              Liquidity, foreign exchange, finality, and the compliance surface
              are handled beneath the API.
            </p>

            <div className="mt-10 space-y-7">
              {perks.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  className="border-l border-brass/40 pl-5"
                >
                  <h3 className="font-medium">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist-dim">{p.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="panel overflow-hidden rounded-md">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
                <span className="font-mono text-[11px] text-mist-faint">settle.ts</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mist-faint">
                  TypeScript
                </span>
              </div>
              <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-relaxed">
                {codeLines.map((line, i) => (
                  <div key={i} className="flex">
                    <span className="mr-5 w-4 select-none text-right text-mist-faint/50">
                      {line.t ? i + 1 : ''}
                    </span>
                    <span className={line.c || 'text-mist'}>{line.t || ' '}</span>
                  </div>
                ))}
              </pre>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="panel mt-5 overflow-hidden rounded-md"
            >
              <div className="border-b border-white/[0.07] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-mist-faint">
                Core endpoints
              </div>
              <div className="divide-y divide-white/[0.04] font-mono text-xs">
                {endpoints.map((e) => (
                  <div key={e.path} className="flex items-center gap-4 px-5 py-2.5">
                    <span
                      className={`w-10 flex-none text-[10px] font-medium ${
                        e.method === 'POST' ? 'text-azure' : 'text-brass'
                      }`}
                    >
                      {e.method}
                    </span>
                    <span className="flex-none text-mist">{e.path}</span>
                    <span className="ml-auto hidden truncate text-right text-mist-faint sm:block">
                      {e.desc}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
