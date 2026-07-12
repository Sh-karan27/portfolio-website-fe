import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useTheme from '../hooks/useTheme'
import { getProjectBySlug } from '../lib/api'

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

function DetailsHeader() {
  const { theme, toggleTheme } = useTheme()
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <div className="mx-auto flex max-w-[720px] items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link to="/#projects" className="font-mono text-[13px] font-semibold text-ink-2 hover:text-accent">
          ← Back to Projects
        </Link>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-line-2 text-ink"
        >
          {theme === 'light' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  )
}

function ProjectDetailsPage() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setProject(null)
    setNotFound(false)

    getProjectBySlug(slug)
      .then((data) => {
        if (!cancelled) setProject(data)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (notFound) {
    return (
      <div className="min-h-screen bg-bg text-ink">
        <DetailsHeader />
        <div className="mx-auto max-w-[720px] px-5 py-24 text-center sm:px-8">
          <div className="font-mono text-[13px] text-ink-3">404</div>
          <h1 className="mt-2 font-serif text-2xl font-semibold">Project not found</h1>
          <Link to="/#projects" className="mt-5 inline-block text-[13.5px] font-semibold text-accent">
            ← Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg text-ink-2">
        <div className="font-mono text-[13px]">Loading project…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <DetailsHeader />

      <main className="fade-up mx-auto max-w-[720px] px-5 py-14 sm:px-8 sm:py-20">
        {project.number && <div className="font-mono text-xs text-ink-3">{project.number}</div>}
        <h1 className="mt-2 font-serif text-[clamp(28px,5vw,40px)] font-semibold tracking-tight">
          {project.title}
        </h1>
        {project.stack && <div className="mt-3 font-mono text-xs text-ink-3">{project.stack}</div>}

        {project.coverImage && (
          <img
            src={project.coverImage}
            alt={project.title}
            className="mt-8 w-full rounded-[3px] border border-line-2 object-cover"
          />
        )}

        {project.hasBeforeAfter && ((project.beforeImages?.length ?? 0) > 0 || (project.afterImages?.length ?? 0) > 0) && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">Before</div>
              <div className="flex flex-col gap-3">
                {(project.beforeImages || []).map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`${project.title} — before redesign ${idx + 1}`}
                    className="w-full rounded-[3px] border border-line-2 object-cover"
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">After</div>
              <div className="flex flex-col gap-3">
                {(project.afterImages || []).map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`${project.title} — after redesign ${idx + 1}`}
                    className="w-full rounded-[3px] border border-line-2 object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="mt-9 max-w-[65ch] text-[15px] leading-[1.7] text-ink-2">{project.description}</p>

        <div className="mt-9 flex flex-wrap items-center gap-3.5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[2px] bg-accent px-5 py-2.5 text-[13.5px] font-semibold text-white"
            >
              Live Site ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[2px] border border-line-2 px-5 py-2.5 text-[13.5px] font-semibold text-ink"
            >
              GitHub ↗
            </a>
          )}
        </div>
      </main>
    </div>
  )
}

export default ProjectDetailsPage
