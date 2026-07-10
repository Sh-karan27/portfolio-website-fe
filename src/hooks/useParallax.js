import { useEffect, useRef } from 'react'

// Slowly moves and rotates a decorative element while scrolling.
// The offset is based on how far the element is from the viewport center.
export default function useParallax(speed) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    let frameId = null

    const update = () => {
      frameId = null
      const rect = element.getBoundingClientRect()
      const distance = rect.top + rect.height / 2 - window.innerHeight / 2
      const shift = (-distance * speed).toFixed(2)
      const tilt = (distance * speed * 0.06).toFixed(2)
      element.style.transform = `translateY(${shift}px) rotate(${tilt}deg)`
    }

    // requestAnimationFrame keeps scrolling smooth (max one update per frame)
    const onScroll = () => {
      if (frameId === null) frameId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frameId !== null) cancelAnimationFrame(frameId)
    }
  }, [speed])

  return ref
}
