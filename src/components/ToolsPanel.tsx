import { Terminal } from 'lucide-react'
import { toolItems } from '../data/dashboard'

interface ToolsPanelProps {
  onPromptSelect: (prompt: string) => void
}

export function ToolsPanel({ onPromptSelect }: ToolsPanelProps) {
  return (
    <div className="px-6 pb-8">
      <div className="mx-auto flex max-w-5xl items-center gap-4 py-8">
        <div className="logo-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
          <Terminal size={22} className="text-brand" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">工具箱</h2>
          <p className="mt-1 text-sm text-text-secondary">选择一个实验场景，快速发起芯小智对话</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {toolItems.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onPromptSelect(tool.prompt)}
              className="group glass-card card-accent-top gradient-border flex min-h-32 flex-col rounded-lg p-4 text-left"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-brand/10 text-brand transition-colors group-hover:bg-electric/15 group-hover:text-electric">
                <Icon size={20} />
              </div>
              <p className="mb-1.5 text-sm font-semibold text-text-primary group-hover:text-brand">{tool.title}</p>
              <p className="text-xs leading-relaxed text-text-secondary">{tool.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
