<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types/product'
import type { Category } from '@/types/category'
import { authFetch } from '@/utils/authFetch'
import { imageUrl } from '@/utils/imageUrl'

const props = defineProps<{
  product: Product
  categoryId?: number | null
  categories?: Category[]
  showCategorySelector?: boolean
}>()

const emit = defineEmits<{
  deleted: []
  moved: []
  edited: []
}>()

const newCategoryId = ref(props.product.categoryId)

async function deleteProduct() {
  if (!confirm('Delete this product?')) return

  const res = await authFetch(`/api/products/${props.product.id}`, {
    method: 'DELETE',
  })

  if (res.ok) emit('deleted')
}

async function moveProduct() {
  if (!newCategoryId.value) return

  const res = await authFetch(`/api/products/${props.product.id}/move`, {
    method: 'PUT',
    body: JSON.stringify({ categoryId: newCategoryId.value }),
  })

  if (res.ok) emit('moved')
}
</script>

<template>
  <div class="card">
    <div class="image">
      <img v-if="product.images?.length" :src="imageUrl(product.images[0].url)" class="thumb" />
      <div v-else class="thumb placeholder">No image</div>
    </div>

    <div class="info">
      <div class="title">
        {{ product.name }}
        <span v-if="product.brand" class="brand">({{ product.brand }})</span>
      </div>

      <div class="meta">{{ product.price }} BYN · stock: {{ product.stockQuantity }}</div>

      <div class="cat" v-if="!showCategorySelector">Category: {{ product.categoryId }}</div>

      <div class="move" v-if="showCategorySelector && categories">
        <select v-model.number="newCategoryId">
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>

        <button @click="moveProduct" class="move-btn">Move</button>
      </div>
    </div>

    <div class="actions">
      <button class="edit-btn" @click="$router.push(`/admin/products/${product.id}/edit`)">
        Edit
      </button>

      <button class="delete-btn" @click="deleteProduct">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: var(--card-bg);
  border-radius: 6px;
}

.image .thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #222;
  color: #777;
  font-size: 10px;
}

.info {
  flex: 1;
}

.title {
  font-weight: 500;
  color: var(--text);
}

.brand {
  font-size: 12px;
  color: var(--subtext);
}

.meta {
  font-size: 12px;
  color: var(--subtext);
}

.actions {
  display: flex;
  gap: 6px;
}

.edit-btn {
  padding: 6px 10px;
  background: #3b82f6;
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.delete-btn {
  padding: 6px 10px;
  background: #b91c1c;
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.move select {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--subtext);
  border-radius: 4px;
  padding: 4px;
  font-size: 13px;
}

.move-btn {
  padding: 5px 8px;
  margin-left: 5px;
  background: #10b981;
  border: none;
  color: #fff;
  border-radius: 4px;
}
</style>
