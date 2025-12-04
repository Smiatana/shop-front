<script setup lang="ts">
defineProps<{
  name: string
  price: number
  image?: string
}>()
</script>

<template>
  <div class="product-card">
    <div class="product-img" :style="{ backgroundImage: image ? `url(${image})` : '' }"></div>
    <h3>{{ name }}</h3>
    <p>${{ price }}</p>
  </div>
</template>

<style scoped>
.product-card {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.product-img {
  height: 180px;
  background: #333;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  margin-bottom: 15px;
}
</style>
