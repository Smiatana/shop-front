<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authFetch } from '@/utils/authFetch'
import OrderCard from '@/components/orders/OrderCard.vue'

const orders = ref<any[]>([])
const loading = ref(true)
const error = ref('')

async function loadOrders() {
  const res = await authFetch('/api/admin/orders')
  if (!res.ok) {
    error.value = 'Failed to load orders'
    return
  }
  orders.value = await res.json()
}

async function updateStatus({ orderId, status }: { orderId: number; status: string }) {
  const res = await authFetch(`/api/orders/${orderId}/status?status=${status}`, {
    method: 'PUT',
  })

  if (!res.ok) {
    alert('Failed to update status')
    return
  }

  const order = orders.value.find((o) => o.id === orderId)
  if (order) order.status = status
}

async function deleteOrder(orderId: number) {
  const res = await authFetch(`/api/orders/${orderId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    alert('Failed to delete order')
    return
  }

  orders.value = orders.value.filter((o) => o.id !== orderId)
}

onMounted(async () => {
  await loadOrders()
  loading.value = false
})
</script>

<template>
  <div class="orders-page">
    <h1>Manage Orders</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <OrderCard
        v-for="order in orders"
        :key="order.id"
        :order="order"
        admin
        @update-status="updateStatus"
        @delete="deleteOrder"
      />
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  max-width: 1000px;
}
</style>
