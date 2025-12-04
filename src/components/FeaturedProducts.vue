<script setup lang="ts">
import ProductCard from './ProductCard.vue'

const featured = [
  { name: 'iPhone 15 Pro', price: 999 },
  { name: 'MacBook Air M3', price: 1299 },
  { name: 'Samsung Galaxy Tab S9', price: 799 },
]
</script>

<template>
  <section class="products">
    <h2>Featured</h2>

    <div class="product-grid">
      <ProductCard v-for="(p, i) in featured" :key="i" :name="p.name" :price="p.price" />
    </div>
  </section>
</template>

<style scoped>
.products {
  padding: 40px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}
</style>
