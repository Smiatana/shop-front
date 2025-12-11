<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import { authFetch } from '@/utils/authFetch'
import AdminCategoryBlock from '@/components/admin/AdminCategoryBlock.vue'
import { useAuthStore } from '@/stores/auth'

const categories = ref<Category[]>([])
const expandedCategoryIds = ref<number[]>([])
const searchQuery = ref('')

const API_URL = import.meta.env.VITE_API_URL as string

async function loadCategories() {
  const res = await authFetch('/api/categories')
  if (!res.ok) return
  categories.value = await res.json()
}

function isExpanded(id: number) {
  return expandedCategoryIds.value.includes(id)
}

function toggleExpanded(id: number) {
  if (isExpanded(id)) {
    expandedCategoryIds.value = expandedCategoryIds.value.filter((x) => x !== id)
  } else {
    expandedCategoryIds.value.push(id)
  }
}

async function searchProducts() {
  const q = searchQuery.value.trim()
  if (!q) {
    expandedCategoryIds.value = []
    return
  }

  const res = await authFetch(`/api/products/search?query=${encodeURIComponent(q)}`)
  if (!res.ok) return
  const products: Product[] = await res.json()

  const categoriesWithMatches = Array.from(new Set(products.map((p) => p.categoryId)))
  expandedCategoryIds.value = categoriesWithMatches
}

const newCategory = ref({
  name: '',
  description: '',
  imageFile: null as File | null,
})

function onCategoryImageSelected(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    newCategory.value.imageFile = target.files[0]
  }
}

async function createCategory() {
  const form = new FormData()
  form.append('Name', newCategory.value.name)
  form.append('Description', newCategory.value.description)
  if (newCategory.value.imageFile) {
    form.append('Image', newCategory.value.imageFile)
  }

  const res = await authFetch('/api/categories/with-image', {
    method: 'POST',
    body: form,
  })

  if (!res.ok) return

  newCategory.value = {
    name: '',
    description: '',
    imageFile: null,
  }

  await loadCategories()
}

onMounted(() => {
  const auth = useAuthStore()

  if (auth.token) {
    loadCategories()
    return
  }

  const stop = auth.$subscribe((_, state) => {
    if (state.token) {
      loadCategories()
      stop()
    }
  })
})
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Categories & products</h1>

      <div class="search">
        <input
          v-model="searchQuery"
          class="search-input"
          placeholder="Search products..."
          @keyup.enter="searchProducts"
        />
        <button class="search-btn" @click="searchProducts">Search</button>
      </div>
    </div>

    <section class="panel">
      <h2 class="panel-title">Create category</h2>

      <form class="form" @submit.prevent="createCategory">
        <input v-model="newCategory.name" placeholder="Name" required />
        <input v-model="newCategory.description" placeholder="Description" />
        <input type="file" accept="image/*" @change="onCategoryImageSelected" />
        <button type="submit">Add category</button>
      </form>
    </section>

    <AdminCategoryBlock
      v-for="cat in categories"
      :key="cat.id"
      :category="cat"
      :expanded="isExpanded(cat.id)"
      @toggle="toggleExpanded(cat.id)"
      @category-updated="loadCategories"
    />
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text);
}

.search {
  display: flex;
  gap: 10px;
  align-items: center;
  background: var(--card-bg);
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
}

.search-input {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
  background: color-mix(in srgb, var(--bg) 90%, var(--text) 5%);
  color: var(--text);
  font-size: 14px;
  width: 240px;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent);
  background: color-mix(in srgb, var(--bg) 80%, var(--accent) 10%);
}

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

.panel {
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
  padding: 16px;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 14px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 480px;
}

.form input[type='text'],
.form input[type='file'],
.form textarea {
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

.form input:focus,
.form textarea:focus {
  outline: none;
  border-color: var(--accent);
  background: color-mix(in srgb, var(--bg) 80%, var(--accent) 10%);
}

.form input[type='file'] {
  padding: 8px;
  cursor: pointer;
}

.form button {
  align-self: flex-start;
  padding: 10px 18px;
  border-radius: 6px;
  border: none;
  background: var(--accent);
  color: #000;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    transform 0.1s ease;
}

.form button:hover {
  background: var(--accent-dark);
  transform: translateY(-1px);
}

.form button:active {
  transform: translateY(0);
}
</style>
