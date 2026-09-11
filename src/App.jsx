import { useEffect, useState } from 'react'
import SpaceBackground from './components/SpaceBackground.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Ticker from './components/Ticker.jsx'
import Drip from './components/Drip.jsx'
import RefTeaser from './components/RefTeaser.jsx'
import Reserve from './components/Reserve.jsx'
import Future from './components/Future.jsx'
import Calculator from './components/Calculator.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Stats from './components/Stats.jsx'
import HolderPortal from './components/HolderPortal.jsx'
import PortalPage from './components/PortalPage.jsx'
import ReferralPage from './components/ReferralPage.jsx'
import FAQ from './components/FAQ.jsx'
import CTA from './components/CTA.jsx'
import Footer from './components/Footer.jsx'

function currentRoute() {
  if (window.location.hash.startsWith('#/portal')) return 'portal'
  if (window.location.hash.startsWith('#/referral')) return 'referral'
  return 'home'
}

export default function App() {
  const [route, setRoute] = useState(currentRoute)

  useEffect(() => {
    const onHash = () => {
      const next = currentRoute()
      setRoute(next)
      if (next === 'portal' || next === 'referral') {
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
        ) : route === 'referral' ? (
          <main>
            <ReferralPage />
          </main>
        ) : (
          <main>
            <Hero />
            <Ticker />
            <Drip />
            <RefTeaser />
            <Reserve />
            <Future />
            <Calculator />
            <HowItWorks />
            <Stats />
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
