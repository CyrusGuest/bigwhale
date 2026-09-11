import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function CountUp({ target, decimals = 0, prefix = '', suffix = '', duration = 1.8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    let frame
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - t, 4)
      setValue(target * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, target, duration])

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

const stats = [
  {
    label: 'XRP distributed to date',
    target: 1.24,
    decimals: 2,
    suffix: 'M',
    spark: [3, 4, 4, 5, 7, 8, 8, 10, 12, 13, 15, 18],
  },
  {
    label: 'Distributions executed',
    target: 8760,
    spark: [6, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  },
  {
    label: 'Holding wallets',
    target: 18432,
    spark: [2, 3, 5, 5, 6, 8, 11, 11, 13, 14, 17, 18],
  },
  {
    label: 'Median time between drops',
    target: 60,
    suffix: ' min',
    spark: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  },
]

function Spark({ data, delay }) {
  const max = Math.max(...data)
  return (
    <div className="mx-auto mt-4 flex h-8 w-28 items-end justify-center gap-[3px]">
      {data.map((v, i) => (
        <motion.span
          key={i}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: `${(v / max) * 100}%` }}
          className="w-[5px] origin-bottom rounded-full bg-azure/40"
        />
      ))}
    </div>
  )
}

export default function Stats() {
  return (
    <section id="stats" className="relative overflow-hidden border-y border-white/[0.06] bg-ink-850/50">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-azure-deep/[0.14] blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-brass/30 bg-brass/[0.05] px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-brass">
            Illustrative, live metrics connect at launch
          </span>
        </div>
        <div className="grid grid-cols-2 gap-y-14 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-semibold tabular-nums tracking-tight text-mist sm:text-5xl">
                <CountUp {...s} />
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-mist-faint">
                {s.label}
              </p>
              <Spark data={s.spark} delay={0.3 + i * 0.1} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
