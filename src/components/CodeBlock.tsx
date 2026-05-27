import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockProps {
  language: string
  children: string
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lang = normalizeLanguage(language)

  return (
    <div className="group relative my-3 overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-2">
        <span className="font-mono text-xs text-blue-accent">{lang}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={oneLight}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#f8fafc',
          fontSize: '0.8125rem',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

function normalizeLanguage(lang: string): string {
  const map: Record<string, string> = {
    asm: 'asm',
    assembly: 'asm',
    riscv: 'asm',
    'risc-v': 'asm',
    c: 'c',
    cpp: 'cpp',
    python: 'python',
    bash: 'bash',
    shell: 'bash',
    sh: 'bash',
  }
  return map[lang.toLowerCase()] ?? lang
}
