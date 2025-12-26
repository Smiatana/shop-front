<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { authFetch } from '@/utils/authFetch'
import { imageUrl } from '@/utils/imageUrl'

const images = ref<
  Array<{ id: number; url: string; altText: string | null; username: string; ownerType: string }>
>([])

async function loadImages() {
  const res = await authFetch('/api/admin/images')
  images.value = await res.json()
}

async function removeImage(id: number) {
  if (!confirm('Delete this image?')) return
  await authFetch(`/api/admin/images/${id}`, { method: 'DELETE' })
  images.value = images.value.filter((i) => i.id !== id)
}
onMounted(() => {
  document.querySelector('.app')?.classList.add('admin')
  loadImages()
})

onBeforeUnmount(() => {
  document.querySelector('.app')?.classList.remove('admin')
})
</script>

<template>
  <div class="container">
    <h1 class="page-title">User Uploaded Images</h1>

    <div class="image-grid">
      <div v-for="img in images" :key="img.id" class="image-card">
        <div class="thumbnail-container">
          <img :src="imageUrl(img.url)" class="thumbnail" :alt="img.altText || 'Image'" />
        </div>
        <div class="image-info">
          <div class="username">Uploaded by: {{ img.username }}</div>
          <div class="owner-type">Type: {{ img.ownerType }}</div>
        </div>
        <button class="danger" @click="removeImage(img.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}

.page-title {
  color: #ff8c00;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.image-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.image-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(255, 140, 0, 0.2);
}

.thumbnail-container {
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-info {
  padding: 10px;
  color: var(--subtext);
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.danger {
  background-color: #ff8c00;
  color: var(--card-bg);
  border: none;
  padding: 8px;
  margin: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.danger:hover {
  background-color: #cc3700;
}
</style>
