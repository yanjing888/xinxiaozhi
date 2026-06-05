import { Cpu, Hash, Wrench } from 'lucide-react'
import { referenceItems, toolItems } from '../data/dashboard'

interface DashboardProps {
  onPromptSelect: (prompt: string, prefix?: string) => void
}

const featureTags = ['指令解释', '汇编生成', '开发调试']

export function Dashboard({ onPromptSelect }: DashboardProps) {
  return (
    <div className="flex w-full flex-col gap-5 px-6">
      <header className="text-center">
        <div className="logo-ring mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl">
          <Cpu size={30} className="text-brand" />
        </div>
        <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-brand">
          芯小智
          <span className="ml-2 font-semibold text-electric">RISC-V</span>
        </h2>
        <p className="mx-auto max-w-lg text-sm leading-snug text-text-secondary">
          你的 RISC-V 指令集专属智能助教 — 解答专业问题，生成开发板可用的指令代码
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {featureTags.map((tag) => (
            <span key={tag} className="feature-tag rounded-full px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="glass-card card-accent-top gradient-border rounded-2xl p-4">
          <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-brand">
            <Hash size={16} className="text-electric" />
            指令参考 · 热门问题
          </h3>
          <ul className="space-y-0">
            {referenceItems.map((item) => (
              <li key={item.rank}>
                <button
                  type="button"
                  onClick={() => onPromptSelect(item.prompt)}
                  className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-1.5 text-left transition-colors hover:bg-brand/5"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold ${
                      item.rank <= 3
                        ? 'rank-badge-top'
                        : 'bg-surface-muted text-text-muted'
                    }`}
                  >
                    {item.rank}
                  </span>
                  <span className="truncate text-xs text-text-secondary group-hover:text-brand">
                    {item.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-card card-accent-top gradient-border rounded-2xl p-4">
          <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-brand">
            <Wrench size={16} className="text-electric" />
            实用工具
          </h3>
          <div className="space-y-1">
            {toolItems.map((tool) => {
              const Icon = tool.icon
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onPromptSelect(tool.prompt)}
                  className="group flex w-full items-start gap-2.5 rounded-xl border border-border/80 bg-white/60 p-2 text-left transition-all hover:border-electric/30 hover:bg-white hover:shadow-md"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-electric/15 group-hover:text-electric">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-text-primary group-hover:text-brand">{tool.title}</p>
                    <p className="mt-0.5 text-[10px] leading-snug text-text-muted">{tool.description}</p>
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
