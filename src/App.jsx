import { lazy, Suspense, useEffect, useState } from 'react'
import Backdrop from './components/Backdrop.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Explainer from './components/Explainer.jsx'
import Powers from './components/Powers.jsx'
import Underlying from './components/Underlying.jsx'
import Drip from './components/Drip.jsx'
import FAQ from './components/FAQ.jsx'
import CTA from './components/CTA.jsx'
import Footer from './components/Footer.jsx'

// subpages ship as their own chunks: the home route never needs their code
const PortalPage = lazy(() => import('./components/PortalPage.jsx'))
const AirdropPage = lazy(() => import('./components/AirdropPage.jsx'))
const LegalPage = lazy(() => import('./components/LegalPage.jsx'))

function currentRoute() {
  if (window.location.hash.startsWith('#/portal')) return 'portal'
  if (window.location.hash.startsWith('#/airdrop')) return 'airdrop'
  if (window.location.hash.startsWith('#/legal')) {
    return 'legal:' + (window.location.hash.split('/')[2] || 'risk')
  }
  return 'home'
}

function sectionAnchor() {
  const id = window.location.hash.slice(1)
  return id && !id.startsWith('/') ? id : ''
}

// scroll to a section once it exists; retried briefly while sections mount
function jumpTo(id, behavior) {
  let tries = 0
  const jump = () => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior })
    else if (++tries < 20) setTimeout(jump, 60)
  }
  requestAnimationFrame(jump)
}

export default function App() {
  const [route, setRoute] = useState(currentRoute)

  // the first commit mounts only the backdrop, navbar and hero so the intro's
  // first scene gets painted before the rest of the page is built. The
  // below-fold sections mount two frames later (immediately on a section
  // deep link, so the anchor has something to land on).
  const [belowFold, setBelowFold] = useState(() => Boolean(sectionAnchor()))
  useEffect(() => {
    if (belowFold) return
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => setBelowFold(true))
    })
    return () => cancelAnimationFrame(raf)
  }, [belowFold])

  useEffect(() => {
    const onHash = () => {
      const next = currentRoute()
      setRoute(next)
      if (next !== 'home') {
        window.scrollTo({ top: 0 })
      } else {
        // support section anchors (#faq etc.) after returning from a subpage
        const id = sectionAnchor()
        if (id) jumpTo(id, 'smooth')
      }
    }
    window.addEventListener('hashchange', onHash)
    // honor a section deep link (xto.io/#faq) on first load too
    const initial = sectionAnchor()
    if (initial) jumpTo(initial, 'auto')
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // overflow-x-clip here, not only on html/body: iOS lets the page pan sideways to
  // decorative blobs that poke past the viewport unless an element clips them
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Backdrop />
      <Navbar />
      <div className="relative z-10">
        {route === 'portal' ? (
          <main>
            <Suspense fallback={null}>
              <PortalPage />
            </Suspense>
          </main>
        ) : route === 'airdrop' ? (
          <main>
            <Suspense fallback={null}>
              <AirdropPage />
            </Suspense>
          </main>
        ) : route.startsWith('legal:') ? (
          <main>
            <Suspense fallback={null}>
              <LegalPage doc={route.split(':')[1]} />
            </Suspense>
          </main>
        ) : (
          <main>
            <Hero />
            {belowFold && (
              <>
                <Drip />
                <Explainer />
                <Underlying />
                <Powers />
                <FAQ />
                <CTA />
              </>
            )}
          </main>
        )}
        <Footer />
      </div>
    </div>
  )
}
