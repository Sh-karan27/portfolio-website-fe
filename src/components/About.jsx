import Section from './Section'
import profilePhoto from '../assets/profile.webp'

function About({ data }) {
  return (
    <Section id="about" number={data.sectionNumber} label={data.sectionLabel}>
      <div className="flex flex-wrap items-start gap-[26px]">
        <img
          src={data.photoUrl || profilePhoto}
          alt="Karan Shukla"
          className="h-[170px] w-[170px] shrink-0 rounded border border-line object-cover"
        />
        <div className="min-w-[220px] flex-1">
          <h2 className="font-serif text-[clamp(24px,3.6vw,34px)] font-semibold tracking-tight">
            {data.heading}
          </h2>
          <div className="mt-4 border-l-2 border-accent pl-4 font-serif text-lg italic leading-normal text-ink-2">
            "{data.quote}"
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-[64ch] text-base leading-[1.75] text-ink-2">{data.bio}</p>

      <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] border-l border-t border-line">
        {data.stats.map((stat) => (
          <div key={stat._id || stat.label} className="border-b border-r border-line p-5">
            <div className="font-serif text-[28px] font-semibold text-accent">{stat.value}</div>
            <div className="mt-1 text-[12.5px] text-ink-3">{stat.label}</div>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default About
