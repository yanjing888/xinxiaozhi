interface StreamingIndicatorProps {
  hasContent: boolean
}

export function StreamingIndicator({ hasContent }: StreamingIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${hasContent ? 'mt-2' : 'py-1'}`}>
      {!hasContent && (
        <span className="text-sm text-text-muted">正在思考</span>
      )}
      <span className={`streaming-dots ${hasContent ? 'streaming-dots-sm' : ''}`} aria-hidden>
        <span />
        <span />
        <span />
      </span>
    </div>
  )
}
