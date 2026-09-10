import { useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { XrpMark } from './Hero.jsx'

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// floating XRP marks at different "depths": bigger + more blurred = closer/further
const MARKS = [
  { size: 240, top: '6%', left: '74%', o: 0.05, blur: 'blur-[2px]', dur: 19, dy: -34, rot: 9 },
  { size: 90, top: '26%', left: '5%', o: 0.07, blur: '', dur: 14, dy: -22, rot: -12 },
  { size: 150, top: '52%', left: '86%', o: 0.05, blur: 'blur-[3px]', dur: 23, dy: -28, rot: 7 },
  { size: 60, top: '68%', left: '10%', o: 0.09, blur: '', dur: 12, dy: -16, rot: 14 },
  { size: 320, top: '80%', left: '58%', o: 0.035, blur: 'blur-[5px]', dur: 27, dy: -38, rot: -6 },
  { size: 44, top: '14%', left: '32%', o: 0.06, blur: 'blur-[1px]', dur: 16, dy: -14, rot: -16 },
]

// sharper (closer) marks scroll faster than blurred (distant) ones
function ParallaxMark({ m, i }) {
  const { scrollY } = useScroll()
  const speed = m.blur ? 0.03 + i * 0.01 : 0.09 + i * 0.015
  const y = useTransform(scrollY, (v) => -v * speed)
  return (
    <motion.div
      className={`absolute ${m.blur}`}
      style={{ top: m.top, left: m.left, opacity: m.o, width: m.size, height: m.size, y }}
    >
      <motion.div
        animate={{ y: [0, m.dy, 0], rotate: [0, m.rot, 0] }}
        transition={{ duration: m.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 1.4 }}
        className="h-full w-full"
      >
        <XrpMark className="h-full w-full text-azure" strokeWidth={2.4} />
      </motion.div>
    </motion.div>
  )
}

export default function SpaceBackground() {
  const stars = useMemo(() => {
    const rng = mulberry32(42)
    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      x: rng() * 100,
      y: rng() * 100,
      s: rng() * 1.7 + 0.6,
      o: rng() * 0.3 + 0.08,
      delay: rng() * 6,
      dur: rng() * 4 + 3,
    }))
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* deep-space gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 70% at 50% -10%, #101B42 0%, #0B1228 45%, #070B1C 100%)',
        }}
      />

      {/* aurora washes */}
      <div className="absolute -top-64 left-1/2 h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-azure-deep/[0.20] blur-[160px]" />
      <div className="absolute right-[-260px] top-[30%] h-[520px] w-[520px] rounded-full bg-azure/[0.06] blur-[140px]" />
      <div className="absolute bottom-[-200px] left-[-200px] h-[560px] w-[560px] rounded-full bg-azure-deep/[0.16] blur-[150px]" />

      {/* starfield */}
      {stars.map((st) => (
        <span
          key={st.id}
          className="star absolute rounded-full bg-white"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: `${st.s}px`,
            height: `${st.s}px`,
            opacity: st.o,
            animationDelay: `${st.delay}s`,
            animationDuration: `${st.dur}s`,
          }}
        />
      ))}

      {/* drifting XRP marks with scroll parallax */}
      {MARKS.map((m, i) => (
        <ParallaxMark key={i} m={m} i={i} />
      ))}
    </div>
  )
}
