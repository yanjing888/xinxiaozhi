interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <div className="relative flex h-full min-w-0 flex-1 flex-col md:flex-row">{children}</div>
    </div>
  )
}
