import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Section from './Section'
import useParallax from '../hooks/useParallax'

// Clamps text to a fixed number of lines and reveals a Read More/Less
// toggle only when the text actually overflows that many lines.
function ClampText({ text, clampClass, className = '', toggleClassName = 'text-ink-2' }) {
  const ref = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const [overflowing, setOverflowing] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      if (!expanded) {
        setOverflowing(el.scrollHeight > el.clientHeight + 1)
      }
    }
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [text, expanded])

  return (
    <div>
      <p ref={ref} className={`${className} ${expanded ? '' : clampClass}`}>
        {text}
      </p>
      {(overflowing || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className={`mt-1 text-[11px] leading-[1.55] underline underline-offset-2 ${toggleClassName}`}
        >
          {expanded ? 'Read Less' : '...Read More'}
        </button>
      )}
    </div>
  )
}

// Floating laptop icon behind the section
function LaptopDecoration() {
  const parallaxRef = useParallax(0.1)

  return (
    <svg
      ref={parallaxRef}
      width="150"
      height="150"
      viewBox="0 0 24 24"
      fill="var(--accent)"
      className="pointer-events-none absolute right-2 top-1/2 z-0 -translate-y-1/2 opacity-[0.16]"
    >
      <path d="M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5v10H4v-10z" />
      <path d="M2 16.5h20l-1.4 2.6a1 1 0 01-.9.4H4.3a1 1 0 01-.9-.4L2 16.5z" />
      <rect x="10" y="17.5" width="4" height="1" rx="0.5" fill="var(--bg)" />
      <path d="M10 17.5h4" />
    </svg>
  )
}

function ProjectCard({ project }) {
  return (
    <div className="project-card overflow-hidden rounded-xl border border-line bg-card">
      <div className="relative aspect-[3/2] w-full bg-line">
        {project.coverImage && (
          <img src={project.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        {project.tag && (
          <div className="absolute left-2.5 top-2.5 rounded-[5px] bg-black/55 px-[7px] py-[3px] font-mono text-[10px] text-white backdrop-blur-[6px]">
            {project.tag}
          </div>
        )}
      </div>
      <div className="p-3.5 pt-3">
        <div className="font-serif text-[17px] font-bold">{project.title}</div>
        <div className="mt-2">
          <ClampText
            text={project.description}
            clampClass="line-clamp-2"
            className="text-[13px] leading-[1.55] text-ink-2"
          />
        </div>
        <div className="mt-2">
          <ClampText
            text={project.stack}
            clampClass="line-clamp-2"
            className="font-mono text-[11px] text-ink-3"
            toggleClassName="text-ink-3"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <Link to={`/projects/${project.slug}`} className="inline-block text-[13px] font-semibold">
            View Details <span className="project-arrow">↗</span>
          </Link>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[13px] font-semibold"
          >
            GitHub <span className="project-arrow">↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}

function ProjectRow({ project }) {
  return (
    <div className="flex items-start gap-5 py-[26px] sm:gap-7">
      <div className="relative aspect-[4/3] w-[120px] flex-none overflow-hidden rounded-lg bg-line sm:w-[170px]">
        {project.coverImage && (
          <img src={project.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0">
        <div className="mb-2.5 font-serif text-xl font-bold">{project.title}</div>
        <div className="mb-3 max-w-[400px]">
          <ClampText
            text={project.description}
            clampClass="line-clamp-3"
            className="text-[13.5px] leading-[1.6] text-ink-2"
          />
        </div>
        <div className="mb-3.5 max-w-[400px]">
          <ClampText
            text={project.stack}
            clampClass="line-clamp-3"
            className="font-mono text-[11.5px] text-ink-3"
            toggleClassName="text-ink-3"
          />
        </div>
        <div className="flex flex-wrap items-center gap-[18px]">
          <Link to={`/projects/${project.slug}`} className="whitespace-nowrap text-[13px] font-semibold">
            View Details <span className="project-arrow">↗</span>
          </Link>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-[13px] font-semibold"
          >
            GitHub <span className="project-arrow">↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}

function Projects({ data }) {
  const [view, setView] = useState('cards')

  return (
    <Section
      id="projects"
      number={data.sectionNumber}
      label={data.sectionLabel}
      decoration={<LaptopDecoration />}
      wide
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-serif text-[clamp(24px,3.6vw,34px)] font-semibold tracking-tight">
          {data.heading}
        </h2>
        <div className="flex overflow-hidden rounded-[2px] border border-line-2">
          <button
            onClick={() => setView('cards')}
            className={`px-4 py-2 text-[13px] font-semibold ${
              view === 'cards' ? 'bg-accent text-white' : 'bg-transparent text-ink'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 text-[13px] font-semibold ${
              view === 'list' ? 'bg-accent text-white' : 'bg-transparent text-ink'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {view === 'cards' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((project) => (
            <ProjectCard key={project._id || project.number} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-line">
          {data.items.map((project) => (
            <ProjectRow key={project._id || project.number} project={project} />
          ))}
        </div>
      )}
    </Section>
  )
}

export default Projects
