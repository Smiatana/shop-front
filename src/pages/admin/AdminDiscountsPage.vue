<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authFetch } from '@/utils/authFetch'
import AdminDiscountCard from '@/components/admin/AdminDiscountCard.vue'

type Discount = {
  id: number
  productId: number
  productName: string
  percentage: number
  validFrom: string
  validTo: string
  active: boolean
}

const discounts = ref<Discount[]>([])

async function loadDiscounts() {
  const res = await authFetch('/api/discounts')
  if (!res.ok) return

  const data = await res.json()
  discounts.value = data.map((d: any) => ({
    id: d.id,
    productId: d.productId,
    productName: d.product.name,
    percentage: d.percentage,
    validFrom: d.validFrom,
    validTo: d.validTo,
    active: d.active,
  }))
}

onMounted(async () => {
  await loadDiscounts()
})
</script>

<template>
  <div class="page">
    <h1 class="page-title">Discounts</h1>
    <div class="list">
      <AdminDiscountCard
        v-for="d in discounts"
        :key="d.id"
        :discount="d"
        @updated="loadDiscounts"
        @deleted="loadDiscounts"
      />
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
