import { useEffect, useState } from 'react'
import SpaceBackground from './components/SpaceBackground.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Ticker from './components/Ticker.jsx'
import Drip from './components/Drip.jsx'
import Reserve from './components/Reserve.jsx'
import Calculator from './components/Calculator.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Features from './components/Features.jsx'
import Stats from './components/Stats.jsx'
import Transparency from './components/Transparency.jsx'
import HolderPortal from './components/HolderPortal.jsx'
import PortalPage from './components/PortalPage.jsx'
import FAQ from './components/FAQ.jsx'
import CTA from './components/CTA.jsx'
import Footer from './components/Footer.jsx'

function currentRoute() {
  return window.location.hash.startsWith('#/portal') ? 'portal' : 'home'
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
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />
      <div className="relative z-10">
        {route === 'portal' ? (
          <main>
            <PortalPage />
          </main>
        ) : (
          <main>
            <Hero />
            <Ticker />
            <Drip />
            <Reserve />
            <Calculator />
            <HowItWorks />
            <Features />
            <Stats />
            <Transparency />
            <HolderPortal />
            <FAQ />
            <CTA />
          </main>
        )}
        <Footer />
      </div>
    </div>
  )
}
