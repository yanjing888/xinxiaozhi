interface PageShellProps {
  children: React.ReactNode
  className?: string
}

export function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <div className={`relative flex h-full min-h-0 flex-col overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
