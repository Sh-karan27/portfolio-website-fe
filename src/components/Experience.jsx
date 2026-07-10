import Section from './Section'
import useParallax from '../hooks/useParallax'

// Floating briefcase icon behind the section
function BriefcaseDecoration() {
  const parallaxRef = useParallax(0.14)

  return (
    <div
      ref={parallaxRef}
      className="pointer-events-none absolute left-2.5 top-3 z-0 h-[90px] w-[90px] text-accent opacity-[0.16]"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M9 4a2 2 0 012-2h2a2 2 0 012 2v1h3.5A2.5 2.5 0 0121 7.5V10a13 13 0 01-9 3.5A13 13 0 013 10V7.5A2.5 2.5 0 015.5 5H9V4zm2 0v1h2V4h-2zM3 12.1A14.9 14.9 0 0012 15a14.9 14.9 0 009-2.9v5.4A2.5 2.5 0 0118.5 20h-13A2.5 2.5 0 013 17.5v-5.4z" />
        <circle cx="16.2" cy="16" r="4.6" fill="var(--bg)" stroke="currentColor" strokeWidth="1.1" />
        <path d="M16.2 13.6v2.6l1.7 1" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function Experience({ data }) {
  return (
    <Section id="experience" number={data.sectionNumber} label={data.sectionLabel} decoration={<BriefcaseDecoration />}>
      <h2 className="mb-8 font-serif text-[clamp(24px,3.6vw,34px)] font-semibold tracking-tight">
        {data.heading}
      </h2>

      {data.jobs.map((job, index) => (
        <div
          key={job._id || job.role}
          className={`${index < data.jobs.length - 1 ? 'mb-[30px] border-b border-line pb-[30px]' : ''}`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-serif text-[19px] font-semibold">{job.role}</h3>
            <div className="font-mono text-[13px] text-ink-3">{job.period}</div>
          </div>
          <ul className="mt-[18px] flex flex-col gap-2.5">
            {job.points.map((point) => (
              <li
                key={point}
                className="border-l-2 border-accent pl-4 text-[15px] leading-[1.65] text-ink-2"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Section>
  )
}

export default Experience
