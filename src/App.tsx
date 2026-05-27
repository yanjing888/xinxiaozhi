import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { ToolsPanel } from './components/ToolsPanel'
import { ChatPanel, HomeChatBar } from './components/ChatPanel'
import { useChat } from './hooks/useChat'

type View = 'home' | 'tools' | 'chat'

export default function App() {
  const chat = useChat()
  const [view, setView] = useState<View>('home')

  const handleNewChat = () => {
    chat.newSession()
    setView('chat')
  }

  const handlePromptSelect = (prompt: string, prefix?: string) => {
    setView('chat')
    const text = prompt || '你好，请介绍一下你能帮我做什么'
    chat.sendMessage(text, prefix ? { prefix } : undefined)
  }

  const handleStartChat = () => {
    setView('chat')
  }

  return (
    <div className="flex h-full bg-surface-secondary">
      <Sidebar
        sessions={chat.sessions}
        activeSessionId={chat.activeSessionId}
        view={view}
        onNewChat={handleNewChat}
        onSelectSession={chat.selectSession}
        onNavigate={setView}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {view === 'home' && (
          <>
            <div className="flex-1 overflow-hidden">
              <Dashboard onPromptSelect={handlePromptSelect} />
            </div>
            <HomeChatBar chat={chat} onStartChat={handleStartChat} />
          </>
        )}

        {view === 'tools' && (
          <>
            <div className="flex-1 overflow-hidden">
              <ToolsPanel onPromptSelect={(prompt) => handlePromptSelect(prompt)} />
            </div>
            <HomeChatBar chat={chat} onStartChat={handleStartChat} />
          </>
        )}

        {view === 'chat' && <ChatPanel chat={chat} />}
      </main>
    </div>
  )
}
