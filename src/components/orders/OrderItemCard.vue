<script setup lang="ts">
import { imageUrl } from '@/utils/imageUrl'

defineProps<{
  item: {
    id: number
    productId: number
    name: string
    brand: string
    priceAtPurchase: number
    quantity: number
    firstImage?: { url: string; altText: string; position: number }
  }
}>()
</script>

<template>
  <div class="order-item-card">
    <img
      v-if="item.firstImage"
      :src="imageUrl(item.firstImage.url)"
      :alt="item.firstImage.altText"
    />
    <div class="info">
      <h3>{{ item.name }}</h3>
      <div>{{ item.brand }}</div>
      <div>Quantity: {{ item.quantity }}</div>
      <div>Price per unit: {{ item.priceAtPurchase }} BYN</div>
      <div>Subtotal: {{ item.priceAtPurchase * item.quantity }} BYN</div>
    </div>
  </div>
</template>

<style scoped>
.order-item-card {
  border-radius: 10px;
  display: flex;
  background: var(--card-bg);
  gap: 16px;
  padding: 12px;
  border-bottom: 1px solid var(--card-bg);
}
img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}
.info {
  flex: 1;
}
</style>
