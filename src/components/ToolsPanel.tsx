import { Terminal } from 'lucide-react'
import { toolItems } from '../data/dashboard'

interface ToolsPanelProps {
  onPromptSelect: (prompt: string) => void
}

export function ToolsPanel({ onPromptSelect }: ToolsPanelProps) {
  return (
    <div className="px-6 pb-8">
      <div className="mx-auto flex max-w-5xl items-center gap-4 py-8">
        <div className="logo-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
          <Terminal size={22} className="text-brand" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-brand">工具箱</h2>
          <p className="mt-1 text-sm text-text-secondary">选择工具，快速发起 RISC-V 相关对话</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {toolItems.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onPromptSelect(tool.prompt)}
              className="group glass-card card-accent-top gradient-border flex flex-col rounded-2xl p-5 text-left"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-electric/15 group-hover:text-electric">
                <Icon size={22} />
              </div>
              <p className="mb-2 text-sm font-semibold text-brand">{tool.title}</p>
              <p className="text-xs leading-relaxed text-text-secondary">{tool.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
