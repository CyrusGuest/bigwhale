import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OilMark } from './Hero.jsx'

const links = [
  { label: 'How It Works', href: '#how' },
  { label: 'Why Oil', href: '#oil' },
  { label: 'Holder Portal', href: '#/portal' },
  { label: 'FAQ', href: '#faq' },
]

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('xto-theme', dark ? 'dark' : 'light')
    } catch {}
  }, [dark])
  return [dark, () => setDark((d) => !d)]
}

function ThemeToggle({ dark, onToggle, className = '' }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`flex h-9 w-9 items-center justify-center rounded-sm border border-navy/20 text-mist-dim transition-colors hover:border-navy/50 hover:text-mist ${className}`}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dark, toggleTheme] = useTheme()

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40 border-b border-gold/20 bg-paper/88 backdrop-blur-xl"
    >
      {/* thin tricolor rule: navy · ivory · red, read as a flag at a glance */}
      <div className="flex h-[3px] w-full">
        <span className="flex-1 bg-navy" />
        <span className="flex-1 bg-mist/80" />
        <span className="flex-1 bg-flag" />
      </div>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-gold/40 bg-gold/10 text-gold">
            <OilMark className="h-4 w-4" strokeWidth={5} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-base font-semibold tracking-[0.12em]">XTO</span>
            <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-mist-faint">
              American Oil Reserve
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[13px] font-medium text-mist-dim transition-colors hover:text-mist"
            >
              {l.label}
            </a>
          ))}
          <a href="#cta" className="btn-primary !px-5 !py-2.5 text-[13px]">
            Verify On-Ledger
          </a>
          <ThemeToggle dark={dark} onToggle={toggleTheme} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle dark={dark} onToggle={toggleTheme} />
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
              <a href="#cta" onClick={() => setOpen(false)} className="btn-primary w-fit !px-5 !py-2.5 text-[13px]">
                Verify On-Ledger
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
