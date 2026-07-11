import useReveal from '../hooks/useReveal'

// Shared layout for every section: a numbered mono label on the left,
// content on the right, and a reveal animation when scrolled into view.
// `decoration` is an optional floating background icon.
function Section({ id, number, label, decoration, children }) {
  const revealRef = useReveal()

  return (
    <section id={id} className="relative mx-auto max-w-[960px] border-t border-line px-5 py-[60px] sm:px-8">
      {decoration}
      <div ref={revealRef} className="reveal relative z-10 grid gap-8 md:grid-cols-[120px_1fr]">
        <div className="font-mono text-[13px] text-accent">
          {number} — {label}
        </div>
        <div>{children}</div>
      </div>
    </section>
  )
}

export default Section
