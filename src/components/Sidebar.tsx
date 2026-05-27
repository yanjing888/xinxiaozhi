import {
  Plus,
  Cpu,
  MessageSquare,
} from 'lucide-react'
import { navItems } from '../data/dashboard'
import type { ChatSession } from '../types/chat'

interface SidebarProps {
  sessions: ChatSession[]
  activeSessionId: string
  view: 'home' | 'tools' | 'chat'
  onNewChat: () => void
  onSelectSession: (id: string) => void
  onNavigate: (view: 'home' | 'tools' | 'chat') => void
}

export function Sidebar({
  sessions,
  activeSessionId,
  view,
  onNewChat,
  onSelectSession,
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-accent/10 ring-1 ring-blue-accent/20">
          <Cpu size={18} className="text-blue-accent" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-wide text-text-primary">芯小智</h1>
          <p className="text-[10px] text-text-muted">RISC-V 智能助教</p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-accent to-cyan-accent py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          新建对话
        </button>
      </div>

      <nav className="flex flex-col gap-0.5 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            (item.id === 'home' && view === 'home') ||
            (item.id === 'tools' && view === 'tools') ||
            (item.id === 'history' && view === 'chat')

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === 'home') onNavigate('home')
                else if (item.id === 'tools') onNavigate('tools')
                else if (item.id === 'history') onNavigate('chat')
              }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-blue-accent/10 text-blue-accent'
                  : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-4 flex-1 overflow-y-auto px-3">
        <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-wider text-text-muted">
          最近对话
        </p>
        <div className="flex flex-col gap-0.5">
          {sessions.slice(0, 10).map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => {
                onSelectSession(session.id)
                onNavigate('chat')
              }}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                session.id === activeSessionId && view === 'chat'
                  ? 'bg-blue-accent/10 text-blue-accent'
                  : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
              }`}
            >
              <MessageSquare size={12} className="shrink-0" />
              <span className="truncate">{session.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-accent to-cyan-accent text-xs font-medium text-white">
            开
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-text-primary">开发者</p>
            <p className="truncate text-[10px] text-text-muted">RISC-V 学习模式</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
