<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authFetch } from '@/utils/authFetch'
import { imageUrl } from '@/utils/imageUrl'

type ComparisonProduct = {
  id: number
  name: string
  price: number
  image?: string
  specs: Record<string, any>
}

type SpecRow = {
  key: string
  values: (any | null)[]
}

const route = useRoute()
const router = useRouter()

const products = ref<ComparisonProduct[]>([])
const specs = ref<SpecRow[]>([])
const loading = ref(true)

async function loadComparison() {
  loading.value = true

  const res = await authFetch(`/api/comparisons/category/${route.params.categoryId}`)

  if (!res.ok) {
    router.push('/comparisons')
    return
  }

  const data = await res.json()
  products.value = data.products
  specs.value = data.specs
  loading.value = false
}

async function removeProduct(productId: number) {
  await authFetch(`/api/comparisons/remove/${productId}`, {
    method: 'DELETE',
  })

  await loadComparison()
}

function isNumber(v: any): v is number {
  return typeof v === 'number'
}

function highlight(values: any[], value: any) {
  if (!isNumber(value)) return ''

  const nums = values.filter(isNumber)
  if (!nums.length) return ''

  return value === Math.max(...nums) ? 'best' : ''
}

onMounted(loadComparison)
</script>

<template>
  <div class="page">
    <h1>Product comparison</h1>

    <div v-if="loading">Loading…</div>

    <div v-else-if="products.length === 0">No products to compare.</div>

    <div v-else class="table-wrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th></th>

            <th v-for="p in products" :key="p.id">
              <div class="product-head">
                <button class="remove" @click="removeProduct(p.id)">✕</button>

                <img v-if="p.image" :src="imageUrl(p.image)" :alt="p.name" />

                <router-link :to="`/products/${p.id}`">
                  {{ p.name }}
                </router-link>

                <div class="price">{{ p.price }} BYN</div>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in specs" :key="row.key">
            <td class="spec-name">{{ row.key }}</td>

            <td v-for="(value, idx) in row.values" :key="idx" :class="highlight(row.values, value)">
              {{ value ?? '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 24px;
}

.table-wrap {
  overflow-x: auto;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid var(--card-bg);
  text-align: center;
}

.spec-name {
  text-align: left;
  font-weight: 600;
  color: var(--subtext);
  width: 200px;
}

.product-head {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  position: relative;
}

.product-head img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: var(--card-bg);
  border-radius: 12px;
}

.product-head a {
  text-decoration: none;
  color: var(--text);
  font-weight: 600;
}

.price {
  color: var(--accent);
  font-weight: 700;
}

.remove {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  cursor: pointer;
}

.best {
  background: rgba(0, 200, 83, 0.18);
  font-weight: 700;
}
</style>
