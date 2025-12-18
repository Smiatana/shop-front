export interface ImageDto {
  url: string
  altText: string
  position: number
}

export interface OrderItemDto {
  id: number
  productId: number
  name: string
  brand: string
  priceAtPurchase: number
  quantity: number
  firstImage?: ImageDto
}

export interface OrderDto {
  id: number
  totalPrice: number
  status: string
  createdAt: string
  items: OrderItemDto[]
}
