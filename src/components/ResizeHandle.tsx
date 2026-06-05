import { useCallback, useState } from 'react'

interface ResizeHandleProps {
  onResize: (width: number) => void
  getWidth: () => number
  min: number
  max: number
}

export function ResizeHandle({ onResize, getWidth, min, max }: ResizeHandleProps) {
  const [dragging, setDragging] = useState(false)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidth = getWidth()

      setDragging(true)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX
        const next = Math.min(max, Math.max(min, startWidth + delta))
        onResize(next)
      }

      const handleMouseUp = () => {
        setDragging(false)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [getWidth, max, min, onResize],
  )

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="调整侧边栏宽度"
      className={`resize-handle ${dragging ? 'is-dragging' : ''}`}
      onMouseDown={handleMouseDown}
    />
  )
}
