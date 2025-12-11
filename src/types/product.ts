import type { Image } from './image'

export interface Product {
  id: number
  categoryId: number
  name: string
  brand: string
  price: number
  description: string
  specs: Record<string, unknown>
  stockQuantity: number
  images: Image[]
}
