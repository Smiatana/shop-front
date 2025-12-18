<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authFetch } from '@/utils/authFetch'
import OrderCard from '../components/orders/OrderCard.vue'

const orders = ref<any[]>([])
const loading = ref(true)
const error = ref('')

async function loadOrders() {
  const res = await authFetch('/api/orders')
  if (!res.ok) {
    error.value = 'Failed to load orders'
    return
  }
  orders.value = await res.json()
}

onMounted(async () => {
  await loadOrders()
  loading.value = false
})
</script>

<template>
  <div class="orders-page">
    <h1>Your Orders</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-if="!orders.length" class="empty">You have no orders yet</div>
      <OrderCard v-for="order in orders" :key="order.id" :order="order" />
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}
.empty {
  opacity: 0.6;
  font-style: italic;
}
</style>
