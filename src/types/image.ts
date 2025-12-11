import type { OwnerType } from './owner-type'

export interface Image {
  id: number
  ownerId: number
  ownerType: OwnerType
  url: string
  altText: string
  position: number
}
