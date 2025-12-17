<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authFetch } from '@/utils/authFetch'
import { imageUrl } from '@/utils/imageUrl'
import type { Category } from '@/types/category'

const categories = ref<Category[]>([])
const router = useRouter()

async function loadCategories() {
  const res = await authFetch('/api/categories')
  if (res.ok) categories.value = await res.json()
}

function goToCategory(category: Category) {
  router.push({
    name: 'products',
    query: { categoryId: category.id },
  })
}

onMounted(loadCategories)
</script>

<template>
  <section class="categories">
    <h2>Categories</h2>

    <div class="category-grid">
      <div v-for="c in categories" :key="c.id" class="category-card" @click="goToCategory(c)">
        <div
          class="image"
          :style="c.image ? { backgroundImage: `url(${imageUrl(c.image)})` } : undefined"
        />
        <span>{{ c.name }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.category-card {
  cursor: pointer;
  background: var(--card-bg);
  border-radius: 14px;
  overflow: hidden;
  text-align: center;
  transition: transform 0.2s;
}

.category-card:hover {
  transform: translateY(-4px);
}

.image {
  height: 140px;
  background-size: cover;
  background-position: center;
}

span {
  display: block;
  padding: 12px;
  font-weight: 600;
}
</style>
