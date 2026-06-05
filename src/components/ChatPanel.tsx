import { useEffect, useRef, useState } from 'react'
import { Send, Square, Paperclip, ImageIcon, Cpu } from 'lucide-react'
import { quickChips } from '../data/dashboard'
import type { ChatState } from '../hooks/useChat'
import { ChatMessage } from './ChatMessage'
import { PageShell } from './PageShell'

interface ChatInputProps {
  onSend: (text: string) => void
  isLoading: boolean
  onStop: () => void
  placeholder?: string
  compact?: boolean
}

export function ChatInput({
  onSend,
  isLoading,
  onStop,
  placeholder = '输入 RISC-V 相关问题，或描述你需要生成的指令代码…',
  compact = false,
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return
    onSend(input)
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
  }

  const inputMaxWidth = compact ? '' : 'max-w-5xl'

  return (
    <div className="input-dock">
      {!compact && (
        <div className={`mx-auto flex w-full flex-wrap gap-2 px-4 pt-3 ${inputMaxWidth}`}>
          {quickChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => onSend(chip.prompt)}
              disabled={isLoading}
              className="feature-tag rounded-full transition-all hover:border-electric/40 hover:text-electric disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      <div className={`px-4 ${compact ? 'pb-3 pt-1' : 'pb-5 pt-3'}`}>
        <div
          className={`input-field mx-auto flex w-full ${inputMaxWidth} items-end gap-3 rounded-2xl border border-border/50 bg-white/95 shadow-sm ${compact ? 'p-2.5' : 'p-3'}`}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={isLoading}
            className="max-h-40 min-h-[2.5rem] flex-1 resize-none bg-transparent px-1 py-1.5 text-sm leading-relaxed text-text-primary placeholder-text-muted outline-none disabled:opacity-50"
          />
          <div className="flex items-center gap-1 pb-1">
            <button
              type="button"
              className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-muted hover:text-brand"
              title="上传文件（待接入）"
            >
              <Paperclip size={18} />
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-muted hover:text-brand"
              title="上传图片（待接入）"
            >
              <ImageIcon size={18} />
            </button>
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors hover:bg-red-100"
              >
                <Square size={16} fill="currentColor" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="btn-brand flex h-9 w-9 items-center justify-center rounded-xl disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ChatPanelProps {
  chat: ChatState
  onBack?: () => void
}

export function ChatPanel({ chat }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
  }, [chat.activeSession.messages, chat.isLoading])

  return (
    <PageShell className="min-h-0 flex-1">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        {chat.activeSession.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="logo-ring mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
              <Cpu size={28} className="text-brand" />
            </div>
            <h2 className="mb-2 text-lg font-bold text-brand">开始与芯小智对话</h2>
            <p className="mb-6 max-w-md text-sm text-text-secondary">
              询问 RISC-V 指令含义、生成汇编代码、排查开发板调试问题
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickChips.slice(0, 3).map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => chat.sendMessage(chip.prompt)}
                  className="feature-tag rounded-full px-3 py-1.5 transition-colors hover:border-electric/40 hover:text-electric"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {chat.activeSession.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>

      <ChatInput
        onSend={(text) => chat.sendMessage(text)}
        isLoading={chat.isLoading}
        onStop={chat.stopGeneration}
      />
    </PageShell>
  )
}

interface HomeChatBarProps {
  chat: ChatState
  onSend: (text: string) => void
}

export function HomeChatBar({ chat, onSend }: HomeChatBarProps) {
  return (
    <ChatInput
      onSend={onSend}
      isLoading={chat.isLoading}
      onStop={chat.stopGeneration}
      placeholder="输入文字进行对话吧…"
      compact
    />
  )
}
