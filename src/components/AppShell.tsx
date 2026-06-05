interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <div className="page-glow page-glow-tl" aria-hidden />
      <div className="page-glow page-glow-tr" aria-hidden />
      <div className="page-glow page-glow-bl" aria-hidden />
      <div className="relative flex h-full min-w-0 flex-1">{children}</div>
    </div>
  )
}
