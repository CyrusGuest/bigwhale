import { useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// a pumpjack silhouette: base, samson post, walking beam, horse head, counterweight
function Pumpjack({ className = '', style }) {
  return (
    <svg viewBox="0 0 120 80" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M0 78h120v2H0z" />
      <path d="M44 78 L52 30 h4 L64 78 h-4 L54 40 L48 78z" />
      <path d="M10 78 L22 52 h4 L34 78 h-4 L24 60 L14 78z" />
      <path d="M26 42 L104 30 l1.2 3.6 L27.2 45.6z" />
      <path d="M100 26 h12 l3 8 l-3 8 h-12 l-2-8z" />
      <path d="M106 42 v30" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="26" cy="44" r="5" />
      <circle cx="24" cy="54" r="7" fillOpacity="0.9" />
      <path d="M24 54 L48 72" stroke="currentColor" strokeWidth="2" />
      <path d="M48 72 L52 78" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

// a lattice derrick
function Derrick({ className = '', style }) {
  return (
    <svg viewBox="0 0 60 120" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} style={style} aria-hidden="true">
      <path d="M4 120 L24 4 h12 L56 120" />
      <path d="M8 100 h44 M11 82 h38 M14 64 h32 M17 46 h26 M20 28 h20" />
      <path d="M8 100 L52 82 M52 100 L8 82 M11 82 L49 64 M49 82 L11 64 M14 64 L46 46 M46 64 L14 46 M17 46 L43 28 M43 46 L17 28" strokeOpacity="0.7" />
      <path d="M0 120 h60" strokeWidth="2.4" />
    </svg>
  )
}

// field silhouettes along the horizon; the far row scrolls slower than the near one
const FIELD = [
  { kind: 'pumpjack', left: '-4%', w: 420, o: 0.05, far: true },
  { kind: 'derrick', left: '20%', w: 100, o: 0.045, far: true },
  { kind: 'pumpjack', left: '64%', w: 380, o: 0.05, far: true, flip: true },
  { kind: 'derrick', left: '91%', w: 115, o: 0.045, far: true },
  { kind: 'pumpjack', left: '24%', w: 600, o: 0.07, far: false, desktopOnly: true },
  { kind: 'derrick', left: '60%', w: 160, o: 0.065, far: false },
]

// phones skip the per-scroll-frame parallax work: main-thread style writes on
// every scroll event are exactly what makes mobile scrolling freeze
const PARALLAX_OK =
  typeof window === 'undefined' || !window.matchMedia('(max-width: 768px)').matches

function FieldRow({ items, speed }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, (v) => (PARALLAX_OK ? -v * speed : 0))
  return (
    <motion.div className="absolute inset-x-0 bottom-0" style={{ y: PARALLAX_OK ? y : 0 }}>
      {items.map((f, i) => {
        const Comp = f.kind === 'pumpjack' ? Pumpjack : Derrick
        const h = f.kind === 'pumpjack' ? f.w * (80 / 120) : f.w * 2
        return (
          <Comp
            key={i}
            className={`absolute bottom-0 text-navy ${f.desktopOnly ? 'hidden md:block' : ''}`}
            style={{
              left: f.left,
              width: f.w,
              height: h,
              opacity: f.o,
              transform: f.flip ? 'scaleX(-1)' : undefined,
            }}
          />
        )
      })}
    </motion.div>
  )
}

export default function Backdrop() {
  // sparse amber field lights, breathing slowly
  const lights = useMemo(() => {
    const rng = mulberry32(7)
    return Array.from({ length: 34 }, (_, i) => ({
      id: i,
      x: rng() * 100,
      y: 10 + rng() * 80,
      s: rng() * 2.2 + 1.2,
      o: rng() * 0.25 + 0.08,
      delay: rng() * 6,
      dur: rng() * 5 + 4,
    }))
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* white paper with a soft blue sky at the top; a deep navy night in dark mode */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            'radial-gradient(ellipse 130% 60% at 50% -12%, #E8F0FD 0%, #F5F8FC 45%, #FFFFFF 100%)',
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            'radial-gradient(ellipse 130% 60% at 50% -12%, #14213D 0%, #0D1220 45%, #0B0E15 100%)',
        }}
      />

      {/* engraved ledger grid, like security paper */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(var(--navy) / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--navy) / 0.06) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, black 30%, transparent 100%)',
        }}
      />

      {/* blue and gold washes, kept faint so text stays crisp. Desktop only:
          giant blurred layers inside a fixed backdrop crush phone GPUs */}
      <div className="absolute -top-72 left-1/2 hidden h-[720px] w-[1200px] -translate-x-1/2 rounded-full bg-blue/[0.10] blur-[170px] md:block" />
      <div className="absolute right-[-280px] top-[28%] hidden h-[560px] w-[560px] rounded-full bg-gold/[0.10] blur-[150px] md:block" />
      <div className="absolute bottom-[-220px] left-[-220px] hidden h-[600px] w-[600px] rounded-full bg-blue/[0.08] blur-[160px] md:block" />

      {/* a slow oil sheen drifting across the middle (desktop only) */}
      {PARALLAX_OK && (
        <motion.div
          animate={{ x: ['-8%', '8%', '-8%'], y: ['-3%', '4%', '-3%'] }}
          transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-[48%] h-[380px] w-[900px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{
            background:
              'linear-gradient(90deg, rgb(var(--blue) / 0.08) 0%, rgb(var(--gold) / 0.08) 50%, rgba(179,25,66,0.05) 100%)',
          }}
        />
      )}

      {/* field lights */}
      {lights.map((l) => (
        <span
          key={l.id}
          className="star absolute rounded-full bg-gold"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            width: `${l.s}px`,
            height: `${l.s}px`,
            opacity: l.o,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.dur}s`,
          }}
        />
      ))}

      {/* the field on the horizon, two parallax rows */}
      <FieldRow items={FIELD.filter((f) => f.far)} speed={0.012} />
      <FieldRow items={FIELD.filter((f) => !f.far)} speed={0.03} />

      {/* horizon ground plane */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper via-paper/70 to-transparent" />
    </div>
  )
}
