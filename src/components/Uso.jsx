// every mention of the payout asset links down to "The underlying" section

export function UsoLink({ children = '$USO', className = '' }) {
  return (
    <a
      href="#uso"
      className={`underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:decoration-gold-deep ${className}`}
    >
      {children}
    </a>
  )
}

// capturing group, so split() keeps the matches at the odd indices
const TOKEN = /(\$USOon|\$USO|USOon)/

// turn the $USO / USOon mentions inside a plain string into links
export function uso(text) {
  if (typeof text !== 'string') return text
  const parts = text.split(TOKEN)
  if (parts.length === 1) return text
  return parts.map((part, i) => (i % 2 ? <UsoLink key={i}>{part}</UsoLink> : part))
}
