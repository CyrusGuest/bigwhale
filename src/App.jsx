import { useEffect, useState } from 'react'
import Backdrop from './components/Backdrop.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Explainer from './components/Explainer.jsx'
import Powers from './components/Powers.jsx'
import Drip from './components/Drip.jsx'
import PortalPage from './components/PortalPage.jsx'
import FAQ from './components/FAQ.jsx'
import CTA from './components/CTA.jsx'
import Footer from './components/Footer.jsx'

function currentRoute() {
  if (window.location.hash.startsWith('#/portal')) return 'portal'
  return 'home'
}

export default function App() {
  const [route, setRoute] = useState(currentRoute)

  useEffect(() => {
    const onHash = () => {
      const next = currentRoute()
      setRoute(next)
      if (next === 'portal') {
        window.scrollTo({ top: 0 })
      } else {
        // support section anchors (#faq etc.) after returning from the portal
        const id = window.location.hash.slice(1)
        if (id && !id.startsWith('/')) {
          requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
          })
        }
      }
    }
    window.addEventListener('hashchange', onHash)
    // honor a section deep link (xpy.io/#faq) on first load too
    const initial = window.location.hash.slice(1)
    if (initial && !initial.startsWith('/')) {
      setTimeout(() => document.getElementById(initial)?.scrollIntoView(), 150)
    }
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <div className="relative min-h-screen">
      <Backdrop />
      <Navbar />
      <div className="relative z-10">
        {route === 'portal' ? (
          <main>
            <PortalPage />
          </main>
        ) : (
          <main>
            <Hero />
            <Drip />
            <Explainer />
            <Powers />
            <FAQ />
            <CTA />
          </main>
        )}
        <Footer />
      </div>
    </div>
  )
}
