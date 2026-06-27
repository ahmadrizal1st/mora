import { useState, useEffect } from 'react'

export function useCountUp(
  end: number,
  duration: number = 2000,
  start: number = 0,
  delay: number = 0
) {
  const [count, setCount] = useState(start)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < delay) {
        animationFrameId = requestAnimationFrame(step)
        return
      }

      const activeProgress = progress - delay
      if (activeProgress < duration) {
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - activeProgress / duration, 4)
        setCount(Math.floor(easeProgress * (end - start) + start))
        animationFrameId = requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationFrameId)
  }, [end, duration, start, delay])

  return count
}
