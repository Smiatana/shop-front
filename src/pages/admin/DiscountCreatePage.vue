<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authFetch } from '@/utils/authFetch'

const router = useRouter()
const route = useRoute()

const productId = ref<number | null>(null)
const productName = ref('')
const percentage = ref(0)
const validFromDate = ref('')
const validToDate = ref('')

onMounted(async () => {
  const idParam = route.query.productId
  if (idParam) {
    productId.value = Number(idParam)
    const res = await authFetch(`/api/products/${productId.value}`)
    if (res.ok) {
      const data = await res.json()
      productName.value = data.name
    }
  }
})

async function createDiscount() {
  if (!productId.value) return alert('Product not found')
  if (!validFromDate.value || !validToDate.value) return alert('Select both dates')

  const validFrom = `${validFromDate.value}T00:00:00`
  const validTo = `${validToDate.value}T23:59:00`

  const res = await authFetch('/api/discounts', {
    method: 'POST',
    body: JSON.stringify({
      productId: productId.value,
      percentage: percentage.value,
      validFrom,
      validTo,
    }),
    headers: { 'Content-Type': 'application/json' },
  })

  if (res.ok) {
    router.push('/admin/discounts')
  } else {
    const text = await res.text()
    alert('Error: ' + text)
  }
}
</script>

<template>
  <div class="page">
    <h1 class="page-title">
      Add Discount
      <span v-if="productName">for "{{ productName }}"</span>
    </h1>

    <div class="form">
      <label>Percentage (%)</label>
      <input type="number" v-model.number="percentage" />

      <label>Valid From</label>
      <input type="date" v-model="validFromDate" />

      <label>Valid To</label>
      <input type="date" v-model="validToDate" />

      <button @click="createDiscount">Create Discount</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  padding: 10px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
