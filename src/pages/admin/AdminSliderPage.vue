<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authFetch } from '@/utils/authFetch'
import { imageUrl } from '@/utils/imageUrl'

interface SliderForm {
  title: string
  subtitle: string
  link: string
  image: File | null
}

const sliders = ref<any[]>([])
const form = ref<SliderForm>({
  title: '',
  subtitle: '',
  link: '',
  image: null,
})

const editId = ref<number | null>(null) // currently edited slider

async function load() {
  const res = await authFetch('/api/sliders')
  sliders.value = await res.json()
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  form.value.image = input.files?.[0] || null
}

async function createOrUpdate() {
  if (editId.value && editId.value > 0) {
    // update
    const fd = new FormData()
    if (form.value.image) fd.append('image', form.value.image)
    if (form.value.title) fd.append('title', form.value.title)
    if (form.value.subtitle) fd.append('subtitle', form.value.subtitle)
    if (form.value.link) fd.append('link', form.value.link)

    await authFetch(`/api/sliders/${editId.value}`, {
      method: 'PUT',
      body: fd,
    })
    editId.value = null
  } else {
    // create
    if (!form.value.image) {
      alert('Image is required')
      return
    }

    const fd = new FormData()
    fd.append('image', form.value.image)
    if (form.value.title) fd.append('title', form.value.title)
    if (form.value.subtitle) fd.append('subtitle', form.value.subtitle)
    if (form.value.link) fd.append('link', form.value.link)

    await authFetch('/api/sliders', {
      method: 'POST',
      body: fd,
    })
  }

  form.value = { title: '', subtitle: '', link: '', image: null }
  await load()
}

function editSlider(s: any) {
  editId.value = s.id
  form.value = {
    title: s.title || '',
    subtitle: s.subtitle || '',
    link: s.link || '',
    image: null,
  }
}

async function remove(id: number) {
  if (!confirm('Delete slide?')) return
  await authFetch(`/api/sliders/${id}`, { method: 'DELETE' })
  sliders.value = sliders.value.filter((s) => s.id !== id)
}

onMounted(load)
</script>

<template>
  <div class="slider-admin">
    <h1>Slider</h1>

    <div class="form">
      <input placeholder="Title" v-model="form.title" />
      <input placeholder="Subtitle" v-model="form.subtitle" />
      <input placeholder="Link" v-model="form.link" />
      <input type="file" @change="onFileChange" />

      <button @click="createOrUpdate">
        {{ editId ? 'Update slide' : 'Add slide' }}
      </button>
      <button
        v-if="editId"
        @click="
          () => {
            editId.value = null
            form.value = { title: '', subtitle: '', link: '', image: null }
          }
        "
      >
        Cancel
      </button>
    </div>

    <div class="grid">
      <div v-for="s in sliders" :key="s.id" class="card">
        <img :src="imageUrl(s.image.url)" />
        <h3>{{ s.title }}</h3>
        <p>{{ s.subtitle }}</p>
        <small>{{ s.link }}</small>
        <div class="actions">
          <button @click="() => editSlider(s)">Edit</button>
          <button class="danger" @click="() => remove(s.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider-admin {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.slider-admin h1 {
  font-size: 28px;
  margin-bottom: 24px;
}

.form {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 32px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: 14px;
}

.form input[type='text'],
.form input[type='file'],
.form input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: transparent;
  color: var(--text);
  font-size: 14px;
}

.form input::placeholder {
  color: var(--subtext);
}

.form input[type='file'] {
  grid-column: span 2;
}

.form button {
  grid-column: span 1;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.1s;
}

.form button:hover {
  background: var(--accent-dark);
}

.form button:active {
  transform: scale(0.98);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
}

.card h3 {
  font-size: 16px;
  margin: 4px 0 0;
}

.card p {
  font-size: 14px;
  color: var(--subtext);
  margin: 0;
}

.card small {
  font-size: 12px;
  color: var(--subtext);
  word-break: break-all;
}

.card .actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.card .actions button {
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 13px;
}

.card .actions .danger {
  background: #e53935;
  color: #fff;
}

.card .actions .danger:hover {
  background: #c62828;
}

@media (max-width: 800px) {
  .form {
    grid-template-columns: 1fr;
  }

  .form input[type='file'],
  .form button {
    grid-column: span 1;
  }
}
</style>
