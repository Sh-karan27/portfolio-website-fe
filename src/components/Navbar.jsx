import { useEffect, useState } from 'react'
import useTheme from '../hooks/useTheme'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.4M12 19.6V22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2 12h2.4M19.6 12H22M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  // Lock background scroll while the full-screen mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-line bg-bg">
        <div className="mx-auto flex max-w-[960px] items-center justify-between gap-5 px-5 py-5 sm:px-8">
          <a href="#top" className="font-serif text-[19px] font-semibold tracking-tight text-ink">
            Karan Shukla
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-[26px] md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13.5px] font-medium text-ink-2 hover:text-accent"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-line-2 text-ink"
            >
              {theme === 'light' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-line-2 text-ink"
            >
              {theme === 'light' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-line-2 text-ink"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-[100] flex transform-gpu flex-col bg-bg transition-transform duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform md:hidden ${
          menuOpen ? 'translate-y-0' : 'pointer-events-none -translate-y-full'
        }`}
      >
        <div className="flex h-[73px] flex-shrink-0 items-center justify-between border-b border-line px-5 sm:px-8">
          <a
            href="#top"
            onClick={() => setMenuOpen(false)}
            className="font-serif text-[19px] font-semibold tracking-tight text-ink"
          >
            Karan Shukla
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-line-2 text-ink-2 hover:text-ink"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-5 pt-6 sm:px-8">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : '0ms' }}
              className="border-b border-line py-4 font-serif text-3xl font-semibold tracking-tight text-ink transition-all duration-200 hover:pl-3 hover:text-accent sm:py-5 sm:text-4xl"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Navbar
