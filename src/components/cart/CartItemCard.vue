<script setup lang="ts">
import { imageUrl } from '@/utils/imageUrl'

defineProps<{
  item: {
    id: number
    productId: number
    quantity: number
    product: {
      name: string
      price: number
      discountedPrice: number
      discountPercentage: number
      images?: { url: string }[]
    }
  }
}>()

defineEmits(['update', 'remove'])
</script>

<template>
  <div class="cart-item">
    <img v-if="item.product.images?.length" :src="imageUrl(item.product.images[0].url)" />

    <div class="info">
      <h3>{{ item.product.name }}</h3>

      <div class="price">
        <span v-if="item.product.discountPercentage > 0" class="original">
          {{ item.product.price }} BYN
        </span>
        <span class="discounted">{{ item.product.discountedPrice }} BYN</span>
      </div>

      <div class="controls">
        <input
          type="number"
          min="1"
          :value="item.quantity"
          @change="$emit('update', +$event.target.value)"
        />
        <button class="remove" @click="$emit('remove')">Remove</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: 14px;
}

img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.price {
  margin-top: 6px;
}

.original {
  text-decoration: line-through;
  opacity: 0.6;
  margin-right: 8px;
}

.discounted {
  font-weight: bold;
  color: var(--accent);
}

.controls {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.remove {
  background: #ff4d4d;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
