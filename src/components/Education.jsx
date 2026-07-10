import Section from './Section'
import useParallax from '../hooks/useParallax'

// Floating graduation cap icon behind the section
function CapDecoration() {
  const parallaxRef = useParallax(-0.12)

  return (
    <svg
      ref={parallaxRef}
      width="140"
      height="140"
      viewBox="0 0 24 24"
      fill="var(--accent)"
      className="pointer-events-none absolute left-2 top-2.5 z-0 opacity-[0.16]"
    >
      <path d="M2 9l10-5 10 5-10 5-10-5z" />
      <path d="M6 11.8v4.2c0 1.5 3 3 6 3s6-1.5 6-3v-4.2l-6 3-6-3z" />
      <rect x="20.5" y="9" width="1" height="6" rx="0.5" />
    </svg>
  )
}

function Education({ data }) {
  return (
    <Section id="education" number={data.sectionNumber} label={data.sectionLabel} decoration={<CapDecoration />}>
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h2 className="font-serif text-[19px] font-semibold">{data.degree}</h2>
          <div className="mt-1.5 text-[14.5px] text-ink-2">{data.institution}</div>
          <div className="mt-1.5 text-[13px] text-ink-3">{data.coursework}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[13px] text-ink-3">{data.period}</div>
          <div className="mt-1.5 font-serif text-2xl font-semibold text-accent">
            {data.score} <span className="text-sm text-ink-3">{data.scoreScale}</span>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Education
