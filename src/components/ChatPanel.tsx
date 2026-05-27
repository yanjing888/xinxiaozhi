import { useEffect, useRef, useState } from 'react'
import { Send, Square, Paperclip, ImageIcon } from 'lucide-react'
import { quickChips } from '../data/dashboard'
import type { ChatState } from '../hooks/useChat'
import { ChatMessage } from './ChatMessage'

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

  return (
    <div className={compact ? '' : 'border-t border-border bg-surface/90 backdrop-blur-md'}>
      {!compact && (
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {quickChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => onSend(chip.prompt)}
              disabled={isLoading}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary shadow-sm transition-all hover:border-blue-accent/40 hover:text-blue-accent disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      <div className="p-4">
        <div className="gradient-border flex items-end gap-2 rounded-2xl border border-border bg-surface p-2 shadow-sm">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={isLoading}
            className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none disabled:opacity-50"
          />
          <div className="flex items-center gap-1 pb-1">
            <button
              type="button"
              className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary"
              title="上传文件（待接入）"
            >
              <Paperclip size={18} />
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary"
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
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-accent to-cyan-accent text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40"
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
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.activeSession.messages])

  return (
    <div className="flex h-full flex-col bg-surface-secondary">
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {chat.activeSession.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-accent/10 text-3xl">
              🔬
            </div>
            <h2 className="mb-2 text-lg font-semibold text-text-primary">开始与芯小智对话</h2>
            <p className="max-w-md text-sm text-text-secondary">
              询问 RISC-V 指令含义、生成汇编代码、排查开发板调试问题
            </p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {chat.activeSession.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput
        onSend={(text) => chat.sendMessage(text)}
        isLoading={chat.isLoading}
        onStop={chat.stopGeneration}
      />
    </div>
  )
}

interface HomeChatBarProps {
  chat: ChatState
  onStartChat: () => void
}

export function HomeChatBar({ chat, onStartChat }: HomeChatBarProps) {
  const handleSend = (text: string) => {
    onStartChat()
    chat.sendMessage(text)
  }

  return (
    <ChatInput
      onSend={handleSend}
      isLoading={chat.isLoading}
      onStop={chat.stopGeneration}
      placeholder="输入文字进行对话吧…"
    />
  )
}
