export interface UserProfile {
  id: number
  email: string
  name: string
  role: string
  profileInfo?: Record<string, unknown>
  images?: unknown[]
}
