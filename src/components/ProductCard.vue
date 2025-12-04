<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

defineProps<{
  name: string
  price: number
  image?: string
}>()

const auth = useAuthStore()
</script>

<template>
  <div class="actions">
    <template v-if="auth.isAdmin">
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </template>

    <template v-else-if="auth.isAuthenticated">
      <button class="add-cart">Add to Cart</button>
      <button class="add-compare">Compare</button>
    </template>

    <template v-else>
      <router-link to="/login" class="login-required">Log in to buy</router-link>
    </template>
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
