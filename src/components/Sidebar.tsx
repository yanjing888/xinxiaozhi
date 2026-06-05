import {
  Plus,
  Cpu,
  MessageSquare,
  LogOut,
  Trash2,
} from 'lucide-react'
import { navItems } from '../data/dashboard'
import type { User } from '../types/auth'
import type { ChatSession } from '../types/chat'

interface SidebarProps {
  width: number
  user: User
  sessions: ChatSession[]
  activeSessionId: string
  view: 'home' | 'tools' | 'chat'
  onNewChat: () => void
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
  onNavigate: (view: 'home' | 'tools' | 'chat') => void
  onLogout: () => void
}

export function Sidebar({
  width,
  user,
  sessions,
  activeSessionId,
  view,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onNavigate,
  onLogout,
}: SidebarProps) {
  const avatarChar = user.username.slice(0, 1).toUpperCase()

  return (
    <aside
      className="sidebar-panel flex h-full shrink-0 flex-col"
      style={{ width }}
    >
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="logo-ring flex h-9 w-9 items-center justify-center rounded-xl">
          <Cpu size={18} className="text-brand" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-wide text-brand">芯小智</h1>
          <p className="text-[10px] text-text-muted">
            RISC-V 智能助教
            <span className="ml-1.5 rounded bg-surface-muted px-1 py-0.5 font-mono text-[9px] text-electric">RV32I</span>
          </p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={onNewChat}
          className="btn-brand flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium shadow-sm"
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
            (item.id === 'tools' && view === 'tools')

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === 'home') onNavigate('home')
                else if (item.id === 'tools') onNavigate('tools')
              }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'border-l-2 border-brand bg-brand/5 pl-[10px] font-medium text-brand'
                  : 'border-l-2 border-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary'
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
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId && view === 'chat'
            return (
              <div
                key={session.id}
                className={`group flex items-center rounded-lg transition-colors ${
                  isActive
                    ? 'border-l-2 border-electric bg-brand/5'
                    : 'border-l-2 border-transparent hover:bg-surface-muted'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectSession(session.id)
                    onNavigate('chat')
                  }}
                  className={`flex min-w-0 flex-1 items-center gap-2 py-2 pl-[10px] pr-3 text-left text-xs ${
                    isActive
                      ? 'font-medium text-brand'
                      : 'text-text-secondary group-hover:text-text-primary'
                  }`}
                >
                  <MessageSquare size={12} className="shrink-0" />
                  <span className="truncate">{session.title}</span>
                </button>
                {sessions.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSession(session.id)
                    }}
                    className="mr-1 rounded p-1 text-text-muted opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    title="删除对话"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-brand/8 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-medium text-white">
            {avatarChar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-text-primary">{user.username}</p>
            <p className="truncate text-[10px] text-text-muted">对话已本地保存</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-muted hover:text-red-500"
            title="退出登录"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
