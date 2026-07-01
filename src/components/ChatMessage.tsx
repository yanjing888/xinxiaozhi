import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './CodeBlock'
import { StreamingIndicator } from './StreamingIndicator'
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
            ? 'bg-surface-muted text-text-secondary'
            : 'bg-white text-brand ring-1 ring-border'
        }`}
      >
        {isUser ? <User size={16} /> : <Cpu size={16} />}
      </div>

      <div
        className={`max-w-[82%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-brand text-white shadow-sm'
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
                      className="rounded bg-surface-muted px-1.5 py-0.5 font-sans text-sm font-medium text-brand"
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
                  return <p className="mb-2 text-sm leading-7 text-text-secondary last:mb-0">{children}</p>
                },
                ul({ children }) {
                  return <ul className="mb-2 list-disc pl-5 text-sm leading-7 text-text-secondary">{children}</ul>
                },
                ol({ children, ...props }) {
                  return <ol {...props} className="mb-2 list-decimal pl-5 text-sm leading-7 text-text-secondary">{children}</ol>
                },
                li({ children }) {
                  return <li className="mb-1">{children}</li>
                },
                h1({ children }) {
                  return <h1 className="mb-2 text-base font-semibold text-text-primary">{children}</h1>
                },
                h2({ children }) {
                  return <h2 className="mb-2 mt-3 text-sm font-semibold text-text-primary first:mt-0">{children}</h2>
                },
                h3({ children }) {
                  return <h3 className="mb-1 text-sm font-medium text-text-primary">{children}</h3>
                },
                a({ href, children }) {
                  return (
                    <a href={href} className="text-electric underline hover:text-brand" target="_blank" rel="noreferrer">
                      {children}
                    </a>
                  )
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {message.streaming && (
              <StreamingIndicator hasContent={!!message.content} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
