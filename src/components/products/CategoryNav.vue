<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authFetch } from '@/utils/authFetch'
import type { Category } from '@/types/category'

const categories = ref<Category[]>([])
const route = useRoute()
const router = useRouter()

async function loadCategories() {
  const res = await authFetch('/api/categories')
  if (res.ok) categories.value = await res.json()
}

function selectCategory(id: number | null) {
  router.push({
    name: 'products',
    query: {
      ...route.query,
      categoryId: id ?? undefined,
    },
  })
}

onMounted(loadCategories)
</script>

<template>
  <div class="category-nav">
    <button class="chip" :class="{ active: !route.query.categoryId }" @click="selectCategory(null)">
      All
    </button>

    <button
      v-for="c in categories"
      :key="c.id"
      class="chip"
      :class="{ active: String(c.id) === route.query.categoryId }"
      @click="selectCategory(c.id)"
    >
      {{ c.name }}
    </button>
  </div>
</template>

<style scoped>
.category-nav {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 8px 4px;
  margin-bottom: 20px;
}

.category-nav::-webkit-scrollbar {
  display: none;
}

.chip {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--card-bg);
  background: var(--card-bg);
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.15s;
}

.chip:hover {
  background: color-mix(in srgb, var(--accent) 10%, var(--card-bg));
}

.chip.active {
  background: var(--accent);
  color: #000;
  border-color: var(--accent);
}
</style>
