import { useState } from 'react'
import { Link } from 'react-router-dom'
import Section from './Section'
import useParallax from '../hooks/useParallax'

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
    <div className="project-card border-b border-r border-line p-[26px]">
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt=""
          className="mb-3.5 h-14 w-14 rounded-[2px] border border-line-2 object-cover"
        />
      )}
      <div className="font-mono text-xs text-ink-3">{project.number}</div>
      <div className="mt-2 font-serif text-[19px] font-semibold">{project.title}</div>
      <p className="mt-2.5 text-[14.5px] leading-[1.6] text-ink-2">{project.description}</p>
      <div className="mt-3.5 font-mono text-xs text-ink-3">{project.stack}</div>
      <div className="mt-3.5 flex flex-wrap items-center gap-4">
        <Link to={`/projects/${project.slug}`} className="inline-block text-[13.5px] font-semibold">
          View Details <span className="project-arrow">↗</span>
        </Link>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[13.5px] font-semibold"
        >
          GitHub <span className="project-arrow">↗</span>
        </a>
      </div>
    </div>
  )
}

function ProjectRow({ project }) {
  return (
    <div className="flex items-start gap-4 border-t border-line py-[22px] sm:gap-5">
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt=""
          className="h-20 w-20 flex-shrink-0 rounded-[2px] border border-line-2 object-cover sm:h-28 sm:w-28"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-5">
        <div>
          <div className="font-serif text-lg font-semibold">{project.title}</div>
          <p className="mt-2.5 max-w-[56ch] text-[14.5px] leading-[1.6] text-ink-2">{project.description}</p>
          <div className="mt-2.5 font-mono text-xs text-ink-3">{project.stack}</div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link to={`/projects/${project.slug}`} className="whitespace-nowrap text-[13.5px] font-semibold">
            View Details ↗
          </Link>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-[13.5px] font-semibold"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </div>
  )
}

function Projects({ data }) {
  const [view, setView] = useState('cards')

  return (
    <Section id="projects" number={data.sectionNumber} label={data.sectionLabel} decoration={<LaptopDecoration />}>
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
        <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {data.items.map((project) => (
            <ProjectCard key={project._id || project.number} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col border-b border-line">
          {data.items.map((project) => (
            <ProjectRow key={project._id || project.number} project={project} />
          ))}
        </div>
      )}
    </Section>
  )
}

export default Projects
