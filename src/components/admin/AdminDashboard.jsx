import { useEffect, useState } from 'react'
import useTheme from '../../hooks/useTheme'
import { getPortfolioContent } from '../../lib/api'
import HeroForm from './sections/HeroForm'
import AboutForm from './sections/AboutForm'
import SocialLinksForm from './sections/SocialLinksForm'
import SkillsForm from './sections/SkillsForm'
import ExperienceForm from './sections/ExperienceForm'
import ProjectsForm from './sections/ProjectsForm'
import EducationForm from './sections/EducationForm'
import ContactForm from './sections/ContactForm'
import FooterForm from './sections/FooterForm'

const SECTIONS = [
  { key: 'hero', label: 'Hero' },
  { key: 'about', label: 'About' },
  { key: 'social', label: 'Social Links' },
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'projects', label: 'Projects' },
  { key: 'education', label: 'Education' },
  { key: 'contact', label: 'Contact' },
  { key: 'footer', label: 'Footer' },
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

function AdminDashboard({ admin, onLogout, onAuthExpired }) {
  const { theme, toggleTheme } = useTheme()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('hero')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    getPortfolioContent()
      .then((data) => {
        if (!cancelled) setContent(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const updateLocalSection = (key, value) => {
    setContent((prev) => ({
      ...prev,
      [key === 'social' ? 'socialLinks' : key]: value,
    }))
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg text-ink-2">
        <div className="font-mono text-[13px]">Loading content…</div>
      </div>
    )
  }

  const sharedFormProps = { onAuthExpired }
  const activeLabel = SECTIONS.find((sec) => sec.key === activeSection)?.label

  return (
    <div className="flex min-h-screen bg-bg text-ink">
      {/* Mobile backdrop, closes the drawer on tap */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-[230px] flex-shrink-0 -translate-x-full flex-col justify-between border-r border-line bg-bg transition-transform duration-200 md:sticky md:top-0 md:min-h-screen md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : ''
        }`}
      >
        <div>
          <div className="border-b border-line px-5 py-[22px]">
            <div className="font-serif text-[17px] font-semibold">Karan Shukla</div>
            <div className="mt-0.5 font-mono text-[11px] text-ink-3">Portfolio CMS</div>
          </div>
          <div className="px-3 py-4">
            <div className="px-2.5 pb-2 font-mono text-[10.5px] tracking-[0.06em] text-ink-3">CONTENT</div>
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.key
              return (
                <div
                  key={sec.key}
                  onClick={() => {
                    setActiveSection(sec.key)
                    setSidebarOpen(false)
                  }}
                  className={`sb-item mb-0.5 flex cursor-pointer items-center gap-2.5 rounded-[2px] px-2.5 py-2.5 text-[13.5px] font-semibold ${
                    isActive ? 'bg-card text-ink' : 'text-ink-2'
                  }`}
                >
                  <span
                    className="h-[5px] w-[5px] flex-shrink-0 rounded-full"
                    style={{ background: isActive ? 'var(--accent)' : 'var(--ink3)' }}
                  />
                  {sec.label}
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-line px-5 py-4">
          <div className="truncate text-[12.5px] text-ink-2">{admin?.email}</div>
          <button onClick={onLogout} className="flex-shrink-0 text-[12px] text-ink-3">
            Log out
          </button>
        </div>
      </div>

      {/* MAIN PANEL */}
      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-bg px-5 py-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-[2px] border border-line-2 text-ink"
          >
            <MenuIcon />
          </button>
          <div className="truncate font-serif text-[15px] font-semibold">{activeLabel}</div>
        </div>

        <div className="mx-auto max-w-[640px] px-5 pb-20 pt-8 sm:px-8 md:pt-11">
          {activeSection === 'hero' && (
            <HeroForm data={content.hero} onSaved={(v) => updateLocalSection('hero', v)} {...sharedFormProps} />
          )}
          {activeSection === 'about' && (
            <AboutForm data={content.about} onSaved={(v) => updateLocalSection('about', v)} {...sharedFormProps} />
          )}
          {activeSection === 'social' && (
            <SocialLinksForm
              data={content.socialLinks}
              onSaved={(v) => updateLocalSection('social', v)}
              {...sharedFormProps}
            />
          )}
          {activeSection === 'skills' && (
            <SkillsForm data={content.skills} onSaved={(v) => updateLocalSection('skills', v)} {...sharedFormProps} />
          )}
          {activeSection === 'experience' && (
            <ExperienceForm
              data={content.experience}
              onSaved={(v) => updateLocalSection('experience', v)}
              {...sharedFormProps}
            />
          )}
          {activeSection === 'projects' && (
            <ProjectsForm
              data={content.projects}
              onSaved={(v) => updateLocalSection('projects', v)}
              {...sharedFormProps}
            />
          )}
          {activeSection === 'education' && (
            <EducationForm
              data={content.education}
              onSaved={(v) => updateLocalSection('education', v)}
              {...sharedFormProps}
            />
          )}
          {activeSection === 'contact' && (
            <ContactForm
              data={content.contact}
              onSaved={(v) => updateLocalSection('contact', v)}
              {...sharedFormProps}
            />
          )}
          {activeSection === 'footer' && (
            <FooterForm data={content.footer} onSaved={(v) => updateLocalSection('footer', v)} {...sharedFormProps} />
          )}
        </div>
      </div>

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="fixed bottom-5 right-5 z-20 grid h-[38px] w-[38px] place-items-center rounded-full border border-line-2 bg-card text-ink"
      >
        {theme === 'light' ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  )
}

export default AdminDashboard
