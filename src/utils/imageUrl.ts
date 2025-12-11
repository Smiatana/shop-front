export function imageUrl(path: string) {
  const base = import.meta.env.VITE_API_URL
  return base + path
}
