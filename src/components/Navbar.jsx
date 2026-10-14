import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AirdropCountdown from './AirdropCountdown.jsx'

const links = [
  { label: 'How It Works', href: '#how' },
  { label: 'Why Oil', href: '#oil' },
  { label: 'Verify On-Ledger', href: '#cta' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40 border-b border-gold/20 bg-paper/88 backdrop-blur-xl"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex flex-col items-start gap-1 leading-none">
          <img src="/logo-xto.png" alt="XTO" width={1000} height={380} className="h-6 w-auto" />
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-mist-faint">
            American Oil Reserve
          </span>
        </a>

        <div className="hidden items-center gap-9 md:flex">
          <AirdropCountdown />
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[13px] font-medium text-mist-dim transition-colors hover:text-mist"
            >
              {l.label}
            </a>
          ))}
          <a href="#/portal" className="btn-primary !px-5 !py-2.5 text-[13px]">
            Holder Portal
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <AirdropCountdown label="Airdrop" />
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
          <span className={`h-px w-5 bg-mist transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-5 bg-mist transition-transform ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-navy/[0.07] md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-mist-dim hover:text-mist"
                >
                  {l.label}
                </a>
              ))}
              <a href="#/portal" onClick={() => setOpen(false)} className="btn-primary w-fit !px-5 !py-2.5 text-[13px]">
                Holder Portal
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
