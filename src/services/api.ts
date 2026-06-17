const TOKEN_KEY = 'xinxiaozhi_token'
const USER_KEY = 'xinxiaozhi_user'

export function getApiBase() {
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  return base.replace(/\/$/, '')
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuth(token: string, user: unknown) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredUser<T>() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

async function parseError(res: Response) {
  try {
    const data = await res.json()
    const message = data?.message
    if (Array.isArray(message)) return message.join('，')
    if (typeof message === 'string') return message
  } catch {
    /* ignore */
  }
  return `请求失败 (${res.status})`
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    throw new Error(await parseError(res))
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
