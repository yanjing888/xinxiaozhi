import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './CodeBlock'
import type { ChatMessage as ChatMessageType } from '../types/chat'
import { Cpu, User } from 'lucide-react'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isUser
            ? 'bg-blue-accent/10 text-blue-accent'
            : 'bg-cyan-accent/10 text-cyan-accent'
        }`}
      >
        {isUser ? <User size={16} /> : <Cpu size={16} />}
      </div>

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-accent text-white'
            : 'border border-border bg-surface text-text-primary shadow-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-slate">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const codeText = String(children).replace(/\n$/, '')

                  if (match) {
                    return <CodeBlock language={match[1]}>{codeText}</CodeBlock>
                  }

                  return (
                    <code
                      className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-xs text-blue-accent"
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
                pre({ children }) {
                  return <>{children}</>
                },
                p({ children }) {
                  return <p className="mb-2 text-sm leading-relaxed text-text-secondary last:mb-0">{children}</p>
                },
                ul({ children }) {
                  return <ul className="mb-2 list-disc pl-4 text-sm text-text-secondary">{children}</ul>
                },
                ol({ children }) {
                  return <ol className="mb-2 list-decimal pl-4 text-sm text-text-secondary">{children}</ol>
                },
                li({ children }) {
                  return <li className="mb-1">{children}</li>
                },
                h1({ children }) {
                  return <h1 className="mb-2 text-base font-semibold text-text-primary">{children}</h1>
                },
                h2({ children }) {
                  return <h2 className="mb-2 text-sm font-semibold text-text-primary">{children}</h2>
                },
                h3({ children }) {
                  return <h3 className="mb-1 text-sm font-medium text-text-primary">{children}</h3>
                },
                a({ href, children }) {
                  return (
                    <a href={href} className="text-blue-accent underline hover:text-cyan-accent" target="_blank" rel="noreferrer">
                      {children}
                    </a>
                  )
                },
              }}
            >
              {message.content || (message.streaming ? '▍' : '')}
            </ReactMarkdown>
            {message.streaming && message.content && (
              <span className="cursor-blink ml-0.5 inline-block text-blue-accent">▍</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
