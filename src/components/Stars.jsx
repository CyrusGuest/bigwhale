// three gold stars between hairlines, the recurring patriotic divider
export default function Stars({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50 sm:w-28" />
      <span className="flex items-center gap-2.5 text-gold">
        <Star className="h-3 w-3" />
        <Star className="h-4 w-4" />
        <Star className="h-3 w-3" />
      </span>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50 sm:w-28" />
    </div>
  )
}

export function Star({ className = 'h-3 w-3' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.8L12 17.7 6 21l1.3-6.8-5-4.7 6.8-.8z" />
    </svg>
  )
}

// a thin navy · ivory · red bar, used as an accent edge on callouts
export function FlagBar({ className = '' }) {
  return (
    <span className={`flex overflow-hidden rounded-full ${className}`} aria-hidden="true">
      <span className="flex-1 bg-navy" />
      <span className="flex-1 bg-mist/80" />
      <span className="flex-1 bg-flag" />
    </span>
  )
}
