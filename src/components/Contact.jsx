import Section from './Section'
import useParallax from '../hooks/useParallax'

// Floating paper-plane icon behind the section
function PlaneDecoration() {
  const parallaxRef = useParallax(0.18)

  return (
    <svg
      ref={parallaxRef}
      width="150"
      height="150"
      viewBox="0 0 24 24"
      fill="var(--accent)"
      className="pointer-events-none absolute bottom-2.5 right-2 z-0 opacity-[0.16]"
    >
      <path d="M22 2L2.5 9.8a.6.6 0 000 1.1L10 14l3.1 7.5a.6.6 0 001.1 0L22 2z" />
      <path d="M22 2L10 14" stroke="var(--bg)" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

function Contact({ data }) {
  return (
    <Section id="contact" number={data.sectionNumber} label={data.sectionLabel} decoration={<PlaneDecoration />}>
      <h2 className="font-serif text-[clamp(26px,4.2vw,42px)] font-semibold tracking-tight">
        {data.heading}
      </h2>
      <p className="mt-[18px] max-w-[52ch] text-base leading-[1.7] text-ink-2">{data.description}</p>
      <div className="mt-7 flex flex-col gap-3 text-[15.5px]">
        <a href={`mailto:${data.email}`}>{data.email}</a>
        <a href={`tel:${data.phone}`}>{data.phone}</a>
        <span className="text-ink-2">{data.location}</span>
      </div>
    </Section>
  )
}

export default Contact
