import { useEffect, useRef } from 'react'

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const startY = useRef(0)
  const currentY = useRef(0)
  const isRefreshing = useRef(false)
  const element = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only start if scrolled to top
      const scrollParent = (e.target as HTMLElement).closest('[data-refresh-enabled="true"]')
      const scrollTop = scrollParent ? (scrollParent as HTMLElement).scrollTop : window.scrollY
      if (scrollTop !== 0) return

      startY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current === 0 || isRefreshing.current) return

      currentY.current = e.touches[0].clientY
      const diff = currentY.current - startY.current

      if (diff > 100) {
        // Trigger refresh
        isRefreshing.current = true
        startY.current = 0
        onRefresh()
      }
    }

    const handleTouchEnd = () => {
      startY.current = 0
      currentY.current = 0
      setTimeout(() => {
        isRefreshing.current = false
      }, 1000)
    }

    const target = element.current
    if (target) {
      target.addEventListener('touchstart', handleTouchStart)
      target.addEventListener('touchmove', handleTouchMove)
      target.addEventListener('touchend', handleTouchEnd)

      return () => {
        target.removeEventListener('touchstart', handleTouchStart)
        target.removeEventListener('touchmove', handleTouchMove)
        target.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [onRefresh])

  return element
}
