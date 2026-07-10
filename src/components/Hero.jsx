import { useEffect, useRef } from 'react'
import SocialLinks from './SocialLinks'

function Hero({ data, socialLinks }) {
  const wrapRef = useRef(null)
  const headingRef = useRef(null)
  const dotsRef = useRef(null)
  const symbolRef = useRef(null)

  useEffect(() => {
    const heading = headingRef.current
    let frameId = null

    // While scrolling: the heading drifts down and fades out,
    // the dot grid and the "{ }" symbol move at different speeds (parallax).
    const update = () => {
      frameId = null
      const y = window.scrollY
      symbolRef.current.style.transform = `translateY(${y * 0.6}px) rotate(${y * 0.04}deg)`
      dotsRef.current.style.transform = `translateY(${y * 0.25}px)`

      const wrapHeight = wrapRef.current.offsetHeight || 1
      const progress = Math.min(Math.max(y / wrapHeight, 0), 1)
      heading.style.transform = `translateY(${(y * 0.15).toFixed(2)}px)`
      heading.style.opacity = String(1 - progress * 0.7)
    }

    const onScroll = () => {
      if (frameId === null) frameId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    // Fade the heading in once, then drop the transition so scrolling
    // afterwards feels instant instead of laggy.
    requestAnimationFrame(() => {
      heading.style.opacity = '1'
    })
    const timerId = setTimeout(() => {
      heading.style.transition = 'none'
    }, 700)

    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frameId !== null) cancelAnimationFrame(frameId)
      clearTimeout(timerId)
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative overflow-hidden">
      {/* Decorative background: dot grid + floating code symbol */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div ref={dotsRef} className="dot-grid absolute -inset-[100px] opacity-40" />
        <svg
          ref={symbolRef}
          width="130"
          height="130"
          viewBox="0 0 24 24"
          className="absolute right-[6%] top-[90px] opacity-40"
        >
          <text
            x="12"
            y="17"
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="700"
            fontSize="20"
            fill="var(--accent)"
          >
            {'{ }'}
          </text>
        </svg>
      </div>

      <section id="top" className="relative z-10 mx-auto max-w-[960px] px-8 pb-[70px] pt-[100px]">
        <div className="fade-up font-mono text-[13px] text-accent">
          {data.sectionNumber} — {data.sectionLabel}
        </div>

        <h1
          ref={headingRef}
          className="mt-5 max-w-[16ch] font-serif text-[clamp(38px,6.6vw,72px)] font-semibold leading-[1.06] tracking-tight opacity-0 transition-opacity duration-[600ms] ease-in-out [transition-delay:60ms] will-change-transform"
        >
          {data.heading}
        </h1>

        <p className="fade-up mt-[26px] max-w-[58ch] text-[17px] leading-[1.75] text-ink-2 [animation-delay:0.12s]">
          {data.description}
        </p>

        <div className="fade-up mt-[34px] flex flex-wrap gap-3.5 [animation-delay:0.18s]">
          <a
            href="/Karan_Shukla_Resume.pdf"
            download="Karan_Shukla_Resume.pdf"
            className="inline-flex items-center gap-2 rounded-[2px] bg-accent px-6 py-3.5 text-[14.5px] font-semibold text-white"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            Download CV
          </a>
          <a
            href={`mailto:${data.email}`}
            className="inline-flex items-center gap-2 rounded-[2px] border border-line-2 px-6 py-3.5 text-[14.5px] font-semibold text-ink"
          >
            {data.email}
          </a>
        </div>

        <div className="fade-up mt-8 flex items-center gap-5 text-[13.5px] text-ink-3 [animation-delay:0.24s]">
          <span>{data.location}</span>
          <span>·</span>
          <SocialLinks links={socialLinks} />
        </div>
      </section>
    </div>
  )
}

export default Hero
