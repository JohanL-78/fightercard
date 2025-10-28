'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollProgressProps {
  color?: string
  height?: number
  position?: 'top' | 'bottom'
}

export default function ScrollProgress({
  color = '#14B8A6',
  height = 3,
  position = 'top',
}: ScrollProgressProps) {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const progress = progressRef.current
    if (!progress) return

    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 'top top',
        end: 'max',
        scrub: 0.3,
        invalidateOnRefresh: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === progress) trigger.kill()
      })
    }
  }, [])

  return (
    <div
      ref={progressRef}
      className="fixed left-0 w-full z-[10000] pointer-events-none"
      style={{
        [position]: 0,
        height: `${height}px`,
        backgroundColor: color,
        transformOrigin: 'left',
        transform: 'scaleX(0)',
      }}
    />
  )
}
