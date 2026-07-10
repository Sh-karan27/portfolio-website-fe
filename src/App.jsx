import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import PortfolioSkeleton from './components/PortfolioSkeleton'
import { getPortfolioContent } from './lib/api'
import fallbackContent from './data/fallbackContent'

function App() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    let cancelled = false

    getPortfolioContent()
      .then((data) => {
        if (!cancelled) setContent(data)
      })
      .catch(() => {
        // API unreachable — fall back to bundled defaults so the site
        // never renders blank for a visitor.
        if (!cancelled) setContent(fallbackContent)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (!content) {
    return (
      <>
        <Navbar />
        <PortfolioSkeleton />
      </>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg text-ink">
      <Navbar />
      <Hero data={content.hero} socialLinks={content.socialLinks} />
      <About data={content.about} />
      <Skills data={content.skills} />
      <Experience data={content.experience} />
      <Projects data={content.projects} />
      <Education data={content.education} />
      <Contact data={content.contact} />
      <Footer data={content.footer} socialLinks={content.socialLinks} />
    </div>
  )
}

export default App
