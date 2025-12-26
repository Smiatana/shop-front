<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authFetch } from '@/utils/authFetch'

const router = useRouter()
const loading = ref(true)

const categories = ref<string[]>([])

async function loadComparisons() {
  try {
    const res = await authFetch('/api/comparisons')
    if (res.ok) {
      categories.value = await res.json()
    } else {
      categories.value = []
    }
  } catch (err) {
    categories.value = []
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(loadComparisons)
</script>

<template>
  <div class="page">
    <h1>Comparisons</h1>

    <div v-if="loading">Loading…</div>

    <div v-else-if="!categories.length" class="empty">You have no products in comparison yet.</div>

    <ul v-else class="list">
      <li v-for="name in categories" :key="name" @click="router.push(`/comparisons/${name}`)">
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  margin-bottom: 20px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list li {
  padding: 14px 18px;
  background: var(--card-bg);
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.list li:hover {
  transform: translateY(-2px);
  background: color-mix(in srgb, var(--card-bg) 85%, var(--accent));
}

.empty {
  color: var(--subtext);
}
</style>
