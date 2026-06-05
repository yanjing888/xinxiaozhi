import { useCallback, useRef, useState } from 'react'
import { AppShell } from './components/AppShell'
import { ResizeHandle } from './components/ResizeHandle'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { ToolsPanel } from './components/ToolsPanel'
import { ChatPanel, HomeChatBar } from './components/ChatPanel'
import { PageShell } from './components/PageShell'
import { LoginModal } from './components/LoginModal'
import { useAuth } from './hooks/useAuth'
import { useChat } from './hooks/useChat'
import { SIDEBAR_MAX, SIDEBAR_MIN, useSidebarWidth } from './hooks/useSidebarWidth'

type View = 'home' | 'tools' | 'chat'

function MainApp() {
  const auth = useAuth()
  const chat = useChat(auth.user?.id)
  const { width: sidebarWidth, setWidth: setSidebarWidth } = useSidebarWidth()
  const sidebarWidthRef = useRef(sidebarWidth)
  sidebarWidthRef.current = sidebarWidth
  const getSidebarWidth = useCallback(() => sidebarWidthRef.current, [])
  const [view, setView] = useState<View>('home')

  if (!auth.user) {
    return <LoginModal auth={auth} />
  }

  const handleNewChat = () => {
    chat.newSession()
    setView('chat')
  }

  const handleAskFromHome = (prompt: string, prefix?: string) => {
    const sessionId = chat.newSession()
    setView('chat')
    const text = prompt || '你好，请介绍一下你能帮我做什么'
    chat.sendMessage(text, { ...(prefix ? { prefix } : {}), sessionId })
  }

  const handleLogout = () => {
    chat.stopGeneration()
    auth.logout()
    setView('home')
  }

  return (
    <AppShell>
      <Sidebar
        width={sidebarWidth}
        user={auth.user}
        sessions={chat.sessions}
        activeSessionId={chat.activeSessionId}
        view={view}
        onNewChat={handleNewChat}
        onSelectSession={chat.selectSession}
        onDeleteSession={chat.deleteSession}
        onNavigate={setView}
        onLogout={handleLogout}
      />

      <ResizeHandle
        onResize={setSidebarWidth}
        getWidth={getSidebarWidth}
        min={SIDEBAR_MIN}
        max={SIDEBAR_MAX}
      />

      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {view === 'home' && (
          <PageShell className="min-h-0 flex-1 overflow-hidden">
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
              <Dashboard onPromptSelect={handleAskFromHome} />
            </div>
            <HomeChatBar chat={chat} onSend={handleAskFromHome} />
          </PageShell>
        )}

        {view === 'tools' && (
          <PageShell className="min-h-0 flex-1">
            <div className="flex-1 overflow-y-auto">
              <ToolsPanel onPromptSelect={(prompt) => handleAskFromHome(prompt)} />
            </div>
            <HomeChatBar chat={chat} onSend={handleAskFromHome} />
          </PageShell>
        )}

        {view === 'chat' && <ChatPanel chat={chat} />}
      </main>
    </AppShell>
  )
}

export default function App() {
  return <MainApp />
}
