import { useAuthStore } from '@/stores/auth'

const API_URL = import.meta.env.VITE_API_URL as string

export async function authFetch(path: string, init: RequestInit = {}) {
  const auth = useAuthStore()
  const headers = new Headers(init.headers || {})

  let tokenToSend: string | null = null

  if (auth.token) {
    tokenToSend = auth.token.startsWith('Bearer ') ? auth.token : `Bearer ${auth.token}`

    headers.set('Authorization', tokenToSend)
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${API_URL}${normalizedPath}`

  console.log('AUTH FETCH ->', {
    url,
    method: init.method ?? 'GET',
    token: tokenToSend,
  })

  return fetch(url, { ...init, headers })
}
