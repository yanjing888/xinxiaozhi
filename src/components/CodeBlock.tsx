import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
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
    <div className="group relative my-3 overflow-hidden rounded-lg border border-slate-700 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2">
        <span className="font-mono text-xs text-electric">{lang}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#0f172a',
          fontSize: '0.8125rem',
          fontFamily: 'Consolas, "JetBrains Mono", monospace',
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
