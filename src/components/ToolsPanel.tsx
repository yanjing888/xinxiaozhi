import { Terminal } from 'lucide-react'
import { toolItems } from '../data/dashboard'

interface ToolsPanelProps {
  onPromptSelect: (prompt: string) => void
}

export function ToolsPanel({ onPromptSelect }: ToolsPanelProps) {
  return (
    <div className="chip-grid-bg flex h-full flex-col overflow-y-auto">
      <div className="border-b border-border bg-surface px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-accent/10 text-blue-accent">
            <Terminal size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">工具箱</h2>
            <p className="text-sm text-text-secondary">选择工具，快速发起 RISC-V 相关对话</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
        {toolItems.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onPromptSelect(tool.prompt)}
              className="group glass-card gradient-border flex flex-col rounded-2xl p-5 text-left transition-all hover:border-blue-accent/30 hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-accent/10 text-blue-accent transition-colors group-hover:bg-blue-accent/15">
                <Icon size={22} />
              </div>
              <p className="mb-2 text-sm font-semibold text-text-primary">{tool.title}</p>
              <p className="text-xs leading-relaxed text-text-secondary">{tool.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
