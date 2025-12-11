<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import { authFetch } from '@/utils/authFetch'
import AdminProductCard from './AdminProductCard.vue'
import AdminProductForm from './AdminProductForm.vue'

const props = defineProps<{
  category: Category
  expanded: boolean
}>()

const emit = defineEmits<{
  toggle: []
  categoryUpdated: []
}>()

const products = ref<Product[]>([])
const loading = ref(false)

async function loadProducts() {
  if (!props.expanded) return
  loading.value = true
  const res = await authFetch(`/api/categories/${props.category.id}/products`)
  if (res.ok) {
    products.value = await res.json()
  }
  loading.value = false
}

watch(
  () => props.expanded,
  (expanded) => {
    if (expanded) {
      loadProducts()
    }
  },
  { immediate: false },
)

const showDeleteConfirm = ref(false)

async function confirmDelete() {
  showDeleteConfirm.value = false

  const res = await authFetch(`/api/categories/${props.category.id}`, {
    method: 'DELETE',
  })

  if (!res.ok) return

  emit('categoryUpdated')
}

async function onProductCreated() {
  await loadProducts()
}

async function onProductDeleted() {
  await loadProducts()
}

async function onProductMoved() {
  await loadProducts()
}
</script>

<template>
  <section class="block">
    <header class="header">
      <div class="header-main" @click="emit('toggle')">
        <span class="chevron">
          {{ expanded ? '▾' : '▸' }}
        </span>
        <div>
          <div class="name">{{ category.name }}</div>
          <div class="desc">{{ category.description }}</div>
        </div>
      </div>

      <button class="danger" @click.stop="showDeleteConfirm = true">Delete</button>
    </header>

    <div v-if="expanded" class="body">
      <AdminProductForm :category-id="category.id" @created="onProductCreated" />

      <div v-if="loading" class="loading">Loading products...</div>

      <div v-else class="products">
        <AdminProductCard
          v-for="p in products"
          :key="p.id"
          :product="p"
          :category-id="category.id"
          @deleted="onProductDeleted"
          @moved="onProductMoved"
        />
      </div>
    </div>
    <div v-if="showDeleteConfirm" class="confirm-overlay">
      <div class="confirm-box">
        <div class="confirm-title">Delete category?</div>
        <div class="confirm-text">
          This will permanently remove the category and all its products.
        </div>

        <div class="confirm-actions">
          <button class="confirm-cancel" @click="showDeleteConfirm = false">Cancel</button>

          <button class="confirm-delete" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.block {
  border-radius: 6px;
  margin-bottom: 8px;
  background: var(--card-bg);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
}

.header-main {
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
}

.chevron {
  color: var(--subtext);
}

.name {
  font-weight: 500;
  color: var(--text);
}

.desc {
  font-size: 12px;
  color: var(--subtext);
}

.body {
  padding: 10px;
  background: var(--bg);
}

.products {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}

.danger {
  padding: 6px 10px;
  border-radius: 4px;
  border: none;
  background: #b91c1c;
  color: #fef2f2;
  cursor: pointer;
  font-size: 13px;
}

.loading {
  font-size: 13px;
  color: #9ca3af;
  margin-top: 8px;
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.confirm-box {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
  width: 320px;
  border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
}

.confirm-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 10px;
}

.confirm-text {
  font-size: 14px;
  color: var(--subtext);
  margin-bottom: 20px;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-cancel {
  padding: 8px 12px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--bg) 90%, var(--text) 5%);
  border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
  color: var(--text);
  cursor: pointer;
}

.confirm-delete {
  padding: 8px 12px;
  border-radius: 6px;
  background: #b91c1c;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
