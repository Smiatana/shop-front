<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { authFetch } from '@/utils/authFetch'
import ProductCard from '@/components/ProductCard.vue'
import type { ProductCardDto } from '@/types/product'

const route = useRoute()
const products = ref<ProductCardDto[]>([])

async function loadProducts() {
  const params = new URLSearchParams()

  if (route.query.categoryId) {
    params.append('categoryId', String(route.query.categoryId))
  }

  const res = await authFetch(`/api/products/search?${params}`)
  if (res.ok) products.value = await res.json()
}

onMounted(loadProducts)
watch(() => route.query.categoryId, loadProducts)
</script>

<template>
  <div class="grid">
    <ProductCard
      v-for="p in products"
      :key="p.id"
      :id="p.id"
      :name="p.name"
      :price="p.price"
      :discounted-price="p.discountedPrice"
      :discount-percentage="p.discountPercentage"
      :image="p.images[0]?.url"
    />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
</style>
