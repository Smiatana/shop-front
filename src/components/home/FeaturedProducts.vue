<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductCard from '../ProductCard.vue'
import { authFetch } from '@/utils/authFetch'

interface DiscountedProduct {
  id: number
  name: string
  price: number
  discountedPrice: number
  discountPercentage: number
  image?: string
}

const discountedProducts = ref<DiscountedProduct[]>([])

async function fetchDiscountedProducts() {
  try {
    const res = await authFetch('/api/products/discounted')
    if (!res.ok) throw new Error('Failed to fetch discounted products')

    const data = await res.json()

    discountedProducts.value = data.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      discountedPrice: p.discountedPrice,
      discountPercentage: p.discountPercentage,
      image: p.images?.[0]?.url,
    }))
  } catch (err) {
    console.error('Failed to load discounted products', err)
  }
}

onMounted(fetchDiscountedProducts)
</script>

<template>
  <section class="products">
    <h2>Discounted</h2>

    <div class="product-grid">
      <ProductCard
        v-for="p in discountedProducts"
        :key="p.id"
        :id="p.id"
        :name="p.name"
        :price="p.price"
        :discounted-price="p.discountedPrice"
        :discount-percentage="p.discountPercentage"
        :image="p.image"
      />
    </div>
  </section>
</template>

<style scoped>
.products {
  padding: 20px;
}

.products h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text);
}

.product-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
</style>
