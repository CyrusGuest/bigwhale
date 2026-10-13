// Entrance reveals are desktop garnish. On phones the content must simply BE
// there the moment the page opens: dozens of simultaneous blur/slide tweens
// during an early scroll are what freeze mobile. Components use this flag as
// `initial={REVEAL ? {...} : false}` — framer renders the final state
// immediately when it's false.
export const REVEAL =
  typeof window === 'undefined' || !window.matchMedia('(max-width: 768px)').matches
