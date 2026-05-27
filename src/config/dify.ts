export function getDifyConfig() {
  const baseUrl = import.meta.env.VITE_DIFY_BASE_URL || ''
  const apiKey = import.meta.env.VITE_DIFY_API_KEY || ''

  const useProxy = import.meta.env.DEV
  const apiBase = useProxy ? '/api/dify' : baseUrl.replace(/\/$/, '')

  return { apiBase, apiKey, useProxy }
}

export const DIFY_USER_ID = 'xinxiaozhi-web-user'
