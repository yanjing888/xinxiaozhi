import { Cpu } from 'lucide-react'
import { referenceItems, toolItems } from '../data/dashboard'

interface DashboardProps {
  onPromptSelect: (prompt: string, prefix?: string) => void
}

export function Dashboard({ onPromptSelect }: DashboardProps) {
  return (
    <div className="chip-grid-bg flex h-full flex-col overflow-y-auto">
      <div className="flex flex-col items-center px-6 pt-10 pb-6 text-center">
        <div className="animate-pulse-glow mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white ring-1 ring-blue-accent/20">
          <Cpu size={36} className="text-blue-accent" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-text-primary">
          芯小智
          <span className="ml-2 bg-gradient-to-r from-blue-accent to-cyan-accent bg-clip-text text-transparent">
            RISC-V
          </span>
        </h2>
        <p className="max-w-lg text-sm text-text-secondary">
          你的 RISC-V 指令集专属智能助教 — 解答专业问题，生成开发板可用的指令代码
        </p>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 px-6 pb-4 xl:grid-cols-2">
        <section className="glass-card gradient-border rounded-2xl p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <span className="text-cyan-accent">#</span>
            指令参考 · 热门问题
          </h3>
          <ul className="space-y-1">
            {referenceItems.map((item) => (
              <li key={item.rank}>
                <button
                  type="button"
                  onClick={() => onPromptSelect(item.prompt)}
                  className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface-muted"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold ${
                      item.rank <= 3
                        ? 'bg-blue-accent/10 text-blue-accent'
                        : 'bg-surface-muted text-text-muted'
                    }`}
                  >
                    {item.rank}
                  </span>
                  <span className="truncate text-xs text-text-secondary group-hover:text-text-primary">
                    {item.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-card gradient-border rounded-2xl p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <span className="text-blue-accent">⚙</span>
            实用工具
          </h3>
          <div className="space-y-2">
            {toolItems.map((tool) => {
              const Icon = tool.icon
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onPromptSelect(tool.prompt)}
                  className="group flex w-full items-start gap-3 rounded-xl border border-border bg-surface-secondary p-3 text-left transition-all hover:border-blue-accent/30 hover:bg-blue-accent/5 hover:shadow-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-accent/10 text-blue-accent transition-colors group-hover:bg-blue-accent/15">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-text-primary">{tool.title}</p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-text-muted">{tool.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
