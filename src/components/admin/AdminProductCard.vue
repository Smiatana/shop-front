<script setup lang="ts">
import type { Product } from '@/types/product'
import { authFetch } from '@/utils/authFetch'

const props = defineProps<{
  product: Product
  categoryId: number
}>()

const emit = defineEmits<{
  deleted: []
  moved: []
}>()

async function deleteProduct() {
  if (!confirm('Delete this product?')) return
  const res = await authFetch(`/api/products/${props.product.id}`, {
    method: 'DELETE',
  })
  if (!res.ok) return
  emit('deleted')
}
</script>

<template>
  <div class="row">
    <div class="main">
      <div class="title">
        {{ product.name }}
        <span v-if="product.brand" class="brand">({{ product.brand }})</span>
      </div>
      <div class="meta">{{ product.price }} BYN · stock: {{ product.stockQuantity }}</div>
    </div>

    <button class="danger" @click.stop="deleteProduct">Delete</button>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-radius: 4px;
  background: var(--bg);
  border: 1px solid #27272a;
}

.main {
  display: flex;
  flex-direction: column;
}

.title {
  color: var(--text);
  font-weight: 500;
}

.brand {
  font-size: 12px;
  color: var(--subtext);
  margin-left: 4px;
}

.meta {
  font-size: 12px;
  color: var(--subtext);
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
</style>
