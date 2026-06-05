import { useCallback, useState } from 'react'

const STORAGE_KEY = 'xinxiaozhi-sidebar-width'
export const SIDEBAR_MIN = 200
export const SIDEBAR_MAX = 420
export const SIDEBAR_DEFAULT = 240

function clamp(value: number) {
  return Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, value))
}

function loadWidth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = Number.parseInt(raw, 10)
      if (!Number.isNaN(parsed)) return clamp(parsed)
    }
  } catch {
    /* ignore */
  }
  return SIDEBAR_DEFAULT
}

export function useSidebarWidth() {
  const [width, setWidthState] = useState(loadWidth)

  const setWidth = useCallback((next: number) => {
    const clamped = clamp(next)
    setWidthState(clamped)
    try {
      localStorage.setItem(STORAGE_KEY, String(clamped))
    } catch {
      /* ignore */
    }
  }, [])

  return { width, setWidth }
}
