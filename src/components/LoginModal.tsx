import { useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import type { AuthState } from '../hooks/useAuth'
import { LoginBackground } from './LoginBackground'

interface LoginModalProps {
  auth: AuthState
}

export function LoginModal({ auth }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'register') {
      if (password !== confirm) return
      await auth.register(username, password)
    } else {
      await auth.login(username, password)
    }
  }

  const passwordMismatch = mode === 'register' && confirm.length > 0 && password !== confirm

  return (
    <div className="relative h-full min-h-screen w-full">
      <LoginBackground />

      <div className="relative flex min-h-screen items-center justify-center px-6 py-10 lg:justify-end lg:px-16 xl:px-24">
        <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-2xl sm:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-brand">芯小智</h1>
            <p className="mt-2 text-sm text-text-secondary">RISC-V 智能助教平台</p>
          </div>

          <div className="mb-6 flex rounded-lg bg-surface-muted p-1">
            <button
              type="button"
              onClick={() => { setMode('login'); auth.clearError() }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${
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
              onClick={() => { setMode('register'); auth.clearError() }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${
                mode === 'register'
                  ? 'bg-white text-brand shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <UserPlus size={16} />
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="至少 2 个字符"
                autoComplete="username"
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">确认密码</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="再次输入密码"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                {passwordMismatch && (
                  <p className="mt-1.5 text-xs text-red-500">两次密码不一致</p>
                )}
              </div>
            )}

            {auth.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">{auth.error}</p>
            )}

            <button
              type="submit"
              disabled={auth.loading || passwordMismatch}
              className="btn-brand flex w-full items-center justify-center rounded-lg py-3 text-sm font-medium disabled:opacity-50"
            >
              {auth.loading ? '处理中…' : mode === 'login' ? '登 录' : '注册并登录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
