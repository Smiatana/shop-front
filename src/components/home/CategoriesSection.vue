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
.categories {
  padding: 32px 16px;
}

.categories h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.category-card {
  cursor: pointer;
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  border: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.15);
}

.image {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-size: cover;
  background-position: center;
  background-color: color-mix(in srgb, var(--bg) 85%, var(--text) 5%);
}

.category-card span {
  padding: 12px 10px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  color: var(--text);
  line-height: 1.2;
}

@media (min-width: 640px) {
  .category-grid {
    gap: 20px;
  }

  .category-card span {
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .category-card span {
    font-size: 16px;
  }
}
</style>
