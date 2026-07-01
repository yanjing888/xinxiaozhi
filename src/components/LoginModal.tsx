import { useState } from 'react'
import { ArrowLeft, LogIn, ShieldCheck, UserPlus } from 'lucide-react'
import type { AuthState } from '../hooks/useAuth'
import { LoginBackground } from './LoginBackground'

interface LoginModalProps {
  auth: AuthState
}

type AuthMode = 'login' | 'register' | 'reset'

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-electric focus:ring-2 focus:ring-electric/15'

export function LoginModal({ auth }: LoginModalProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const switchMode = (next: AuthMode) => {
    setMode(next)
    setSuccessMessage(null)
    auth.clearError()
    if (next === 'login') {
      setPassword('')
      setConfirm('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(null)

    if (mode === 'register') {
      if (password !== confirm) return
      await auth.register(username, password)
      return
    }

    if (mode === 'reset') {
      if (password !== confirm) return
      const message = await auth.resetPassword(username, password)
      if (message) {
        setSuccessMessage(message)
        setPassword('')
        setConfirm('')
      }
      return
    }

    await auth.login(username, password)
  }

  const passwordMismatch =
    (mode === 'register' || mode === 'reset') && confirm.length > 0 && password !== confirm

  const title =
    mode === 'login' ? '欢迎回来' : mode === 'register' ? '创建账号' : '重置密码'

  const subtitle =
    mode === 'login'
      ? '登录后即可使用 RISC-V 智能助教'
      : mode === 'register'
        ? '注册账号，对话记录将云端保存'
        : '输入用户名，设置新密码即可重新登录'

  const submitLabel =
    mode === 'login' ? '登 录' : mode === 'register' ? '注册并登录' : '确认重置'

  return (
    <div className="relative h-full min-h-screen w-full">
      <LoginBackground />

      <div className="relative flex min-h-screen items-center justify-center px-6 py-10 lg:justify-end lg:px-16 xl:px-24">
        <div className="w-full max-w-[440px] overflow-hidden rounded-lg border border-white/70 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur-sm">
          <div className="border-b border-border/70 bg-surface-secondary/80 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand text-white shadow-md shadow-brand/25">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-brand">芯小智</h1>
                <p className="text-xs text-text-secondary">RISC-V 智能助教平台</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-7 sm:px-9">
            {mode === 'reset' ? (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="mb-5 flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-brand"
              >
                <ArrowLeft size={16} />
                返回登录
              </button>
            ) : (
              <div className="mb-6 flex rounded-lg bg-surface-muted p-1">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all ${
                    mode === 'login'
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <LogIn size={16} />
                  登录
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all ${
                    mode === 'register'
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <UserPlus size={16} />
                  注册
                </button>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
              <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="至少 2 个字符"
                  autoComplete="username"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-text-primary">
                    {mode === 'reset' ? '新密码' : '密码'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('reset')}
                      className="text-xs font-medium text-brand transition-colors hover:text-brand-light"
                    >
                      忘记密码？
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  className={inputClass}
                />
              </div>

              {(mode === 'register' || mode === 'reset') && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-primary">确认密码</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="再次输入密码"
                    autoComplete="new-password"
                    required
                    className={inputClass}
                  />
                  {passwordMismatch && (
                    <p className="mt-1.5 text-xs text-red-500">两次密码不一致</p>
                  )}
                </div>
              )}

              {successMessage && (
                <p className="rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
                  {successMessage}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="ml-2 font-medium underline underline-offset-2"
                  >
                    去登录
                  </button>
                </p>
              )}

              {auth.error && (
                <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{auth.error}</p>
              )}

              <button
                type="submit"
                disabled={auth.loading || passwordMismatch}
                className="btn-brand mt-2 flex w-full items-center justify-center rounded-lg py-3 text-sm font-medium disabled:opacity-50"
              >
                {auth.loading ? '处理中…' : submitLabel}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
