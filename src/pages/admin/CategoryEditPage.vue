<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authFetch } from '@/utils/authFetch'
import { imageUrl } from '@/utils/imageUrl'
import type { Category } from '@/types/category'

const route = useRoute()
const router = useRouter()

const category = ref<Category | null>(null)

const name = ref('')
const description = ref('')
const imageFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

async function loadCategory() {
  const res = await authFetch(`/api/categories/${route.params.id}`)
  if (!res.ok) return

  category.value = await res.json()
  name.value = category.value.name
  description.value = category.value.description
}

function onImageSelected(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.[0]) return

  imageFile.value = input.files[0]
  previewUrl.value = URL.createObjectURL(imageFile.value)
}

async function save() {
  if (!category.value) return

  const form = new FormData()
  form.append('Name', name.value)
  form.append('Description', description.value)
  if (imageFile.value) {
    form.append('Image', imageFile.value)
  }

  const res = await authFetch(`/api/categories/${category.value.id}/with-image`, {
    method: 'PUT',
    body: form,
  })

  if (!res.ok) return

  router.push('/admin/categories')
}

onMounted(loadCategory)
</script>

<template>
  <div class="page" v-if="category">
    <h1 class="title">Edit Category</h1>

    <div class="card">
      <div class="image-preview">
        <img v-if="previewUrl" :src="previewUrl" alt="Preview" />
        <img v-else-if="category.image" :src="imageUrl(category.image)" alt="Category image" />
        <div v-else class="placeholder">No image</div>
      </div>

      <label class="file">
        Change image
        <input type="file" accept="image/*" @change="onImageSelected" hidden />
      </label>

      <input v-model="name" placeholder="Category name" />
      <textarea v-model="description" placeholder="Description" rows="3" />

      <div class="actions">
        <button class="cancel" @click="router.back()">Cancel</button>
        <button class="save" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 520px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}

.card {
  background: var(--card-bg);
  padding: 18px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-preview {
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  color: var(--subtext);
}

input,
textarea {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
  background: var(--bg);
  color: var(--text);
}

.file {
  font-size: 13px;
  color: var(--accent);
  cursor: pointer;
  align-self: flex-start;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 8px 14px;
  border-radius: 6px;
}

.save {
  background: var(--accent);
  border: none;
  color: #000;
  padding: 8px 16px;
  border-radius: 6px;
}
</style>
