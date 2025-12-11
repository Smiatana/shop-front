<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Product } from '@/types/product'
import type { Category } from '@/types/category'
import { authFetch } from '@/utils/authFetch'
import { imageUrl } from '@/utils/imageUrl'

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const searchQuery = ref('')
const selectedCategoryId = ref<number | null>(null)

async function loadCategories() {
  const res = await authFetch('/api/categories')
  if (!res.ok) return
  categories.value = await res.json()
}

async function loadAllProducts() {
  const res = await authFetch('/api/products')
  products.value = await res.json()
}

async function search() {
  const params = new URLSearchParams()
  if (searchQuery.value.trim()) {
    params.append('query', searchQuery.value.trim())
  }
  if (selectedCategoryId.value) {
    params.append('categoryId', String(selectedCategoryId.value))
  }

  const res = await authFetch(`/api/products/search?${params.toString()}`)
  if (!res.ok) return
  products.value = await res.json()
}

async function deleteProduct(id: number) {
  if (!confirm('Delete this product?')) return

  const res = await authFetch(`/api/products/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) return

  await search()
}

onMounted(async () => {
  await loadCategories()
  await search()
  await loadAllProducts()
})
</script>

<template>
  <div class="page">
    <h1 class="page-title">Products</h1>

    <div class="filters">
      <input
        v-model="searchQuery"
        class="search-input"
        placeholder="Search by name, brand, description"
        @keyup.enter="search"
      />

      <select v-model.number="selectedCategoryId" class="select">
        <option :value="null">All categories</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>

      <button class="search-btn" @click="search">Search</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td class="image-cell">
            <img v-if="p.images?.length" :src="imageUrl(p.images[0].url)" class="thumb" />

            <div v-else class="thumb placeholder">No image</div>
          </td>

          <td>{{ p.name }}</td>
          <td>{{ p.brand }}</td>
          <td>{{ p.price }} BYN</td>
          <td>{{ p.stockQuantity }}</td>
          <td>{{ p.categoryId }}</td>

          <td class="actions">
            <button class="edit-btn" @click="$router.push(`/admin/products/${p.id}/edit`)">
              Edit
            </button>

            <button class="delete-btn" @click="deleteProduct(p.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
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
  color: var(--text);
}

.filters {
  display: flex;
  gap: 12px;
  align-items: center;
  background: var(--card-bg);
  padding: 14px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
}

.search-input,
.select {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
  background: color-mix(in srgb, var(--bg) 90%, var(--text) 5%);
  color: var(--text);
  font-size: 14px;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.search-input:focus,
.select:focus {
  outline: none;
  border-color: var(--accent);
  background: color-mix(in srgb, var(--bg) 80%, var(--accent) 10%);
}

/* Search button */
.search-btn {
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  background: var(--accent);
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s ease,
    transform 0.1s ease;
}

.search-btn:hover {
  background: var(--accent-dark);
  transform: translateY(-1px);
}

.search-btn:active {
  transform: translateY(0);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
}

.table th,
.table td {
  padding: 12px 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
}

.table th {
  text-align: left;
  font-weight: 600;
  color: var(--subtext);
  background: color-mix(in srgb, var(--card-bg) 90%, var(--text) 5%);
}

.table tr:nth-child(even) td {
  background: color-mix(in srgb, var(--card-bg) 95%, var(--text) 3%);
}

.table tr:nth-child(odd) td {
  background: color-mix(in srgb, var(--card-bg) 98%, var(--text) 2%);
}

.table td {
  color: var(--text);
}

.image-cell {
  width: 60px;
}

.thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  background: #222;
}

.thumb.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #777;
}

.actions {
  display: flex;
  gap: 6px;
}

.edit-btn {
  padding: 6px 10px;
  border-radius: 4px;
  border: none;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
}

.delete-btn {
  padding: 6px 10px;
  border-radius: 4px;
  border: none;
  background: #b91c1c;
  color: #fff;
  cursor: pointer;
}
</style>
