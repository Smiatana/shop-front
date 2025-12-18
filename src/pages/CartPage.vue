<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { authFetch } from '@/utils/authFetch'
import { useRouter } from 'vue-router'
import CartItemCard from '@/components/cart/CartItemCard.vue'

const router = useRouter()
const cart = ref<any>(null)
const loading = ref(true)
const error = ref('')

async function loadCart() {
  const res = await authFetch('/api/cart')
  if (!res.ok) {
    error.value = 'Failed to load cart'
    return
  }
  cart.value = await res.json()
}

onMounted(async () => {
  await loadCart()
  loading.value = false
})

const total = computed(
  () =>
    cart.value?.items.reduce(
      (sum: number, i: any) => sum + i.product.discountedPrice * i.quantity,
      0,
    ) ?? 0,
)

async function updateItem(itemId: number, quantity: number) {
  await authFetch(`/api/cart/items/${itemId}?quantity=${quantity}`, {
    method: 'PUT',
  })
  await loadCart()
}

async function removeItem(itemId: number) {
  await authFetch(`/api/cart/items/${itemId}`, {
    method: 'DELETE',
  })
  await loadCart()
}

async function createOrder() {
  if (!cart.value || !cart.value.items.length) return
  const body = {
    items: cart.value.items.map((i: any) => ({
      productId: i.productId,
      quantity: i.quantity,
    })),
  }

  try {
    const res = await authFetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Order creation failed:', errText)
      error.value = 'Failed to place order.'
      return
    }

    await authFetch('/api/cart/clear', { method: 'DELETE' })

    router.push('/orders')
  } catch (err) {
    console.error(err)
    error.value = 'Something went wrong. Please try again.'
  }
}
</script>

<template>
  <div class="cart-page">
    <h1>Your Cart</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>

    <template v-else>
      <div v-if="!cart.items.length" class="empty">Your cart is empty</div>

      <CartItemCard
        v-for="item in cart.items"
        :key="item.id"
        :item="item"
        @update="updateItem(item.id, $event)"
        @remove="removeItem(item.id)"
      />

      <div v-if="cart.items.length" class="summary">
        <div class="total">Total: {{ total }} BYN</div>
        <button @click="createOrder">Place Order</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cart-page {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}

.summary {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  background: var(--accent);
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.empty {
  opacity: 0.6;
  font-style: italic;
}
</style>
