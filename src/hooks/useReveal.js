import { useEffect, useRef } from 'react'

// Adds the "is-visible" class once the element scrolls into view.
// Pair it with the .reveal CSS class for a fade-and-slide-up effect.
export default function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return ref
}
