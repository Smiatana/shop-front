<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product } from '@/types/product'
import { authFetch } from '@/utils/authFetch'
import type { Category } from '@/types/category'
import { imageUrl } from '@/utils/imageUrl'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const product = ref<Product | null>(null)
const categories = ref<Category[]>([])
const loading = ref(true)

const form = reactive({
  name: '',
  brand: '',
  price: '',
  description: '',
  stockQuantity: '',
  categoryId: 0,
  specs: [] as { key: string; value: string }[],
  newImages: [] as File[],
})

function onImagesSelected(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files) {
    form.newImages = Array.from(target.files)
  }
}

async function loadCategories() {
  const res = await authFetch('/api/categories')
  if (!res.ok) return
  categories.value = await res.json()
}

function addSpecRow() {
  form.specs.push({ key: '', value: '' })
}

function removeSpecRow(i: number) {
  form.specs.splice(i, 1)
}

function buildSpecsJson() {
  const obj: Record<string, unknown> = {}

  for (const row of form.specs) {
    const key = row.key.trim()
    const value = row.value.trim()

    if (!key && !value) continue
    if (!key || !value) throw new Error('Each spec row must have both key and value.')

    const num = Number(value)
    obj[key] = isNaN(num) ? value : num
  }

  return JSON.stringify(obj)
}

async function loadProduct() {
  const res = await authFetch(`/api/products/${id}`)
  if (!res.ok) return

  const data: Product = await res.json()
  product.value = data

  form.name = data.name
  form.brand = data.brand
  form.price = String(data.price)
  form.description = data.description
  form.stockQuantity = String(data.stockQuantity)

  form.specs = Object.entries(data.specs).map(([key, value]) => ({
    key,
    value: String(value),
  }))

  if (form.specs.length === 0) form.specs.push({ key: '', value: '' })

  loading.value = false
}

async function save() {
  const fd = new FormData()

  fd.append('Name', form.name)
  fd.append('Brand', form.brand)
  fd.append('Price', form.price)
  fd.append('Description', form.description)
  fd.append('StockQuantity', form.stockQuantity)
  fd.append('Specs', buildSpecsJson())
  fd.append('CategoryId', String(form.categoryId))

  for (const img of form.newImages) {
    fd.append('Images', img)
  }

  const res = await authFetch(`/api/products/${id}/with-images`, {
    method: 'PUT',
    body: fd,
  })

  if (!res.ok) return

  alert('Saved')
  router.push('/admin/products')
}

async function deleteImage(imageId: number) {
  if (!confirm('Delete this image?')) return

  const res = await authFetch(`/api/images/${imageId}`, {
    method: 'DELETE',
  })

  if (!res.ok) return

  await loadProduct()
}

onMounted(loadProduct)
onMounted(loadCategories)
</script>
<template>
  <div class="page" v-if="!loading">
    <h1>Edit product: {{ product?.name }}</h1>

    <!-- Images -->
    <div class="images">
      <div v-for="img in product!.images" :key="img.id" class="image-box">
        <img :src="imageUrl(img.url)" />
        <button class="delete-img" @click="deleteImage(img.id)">✕</button>
      </div>
    </div>

    <input type="file" multiple accept="image/*" @change="onImagesSelected" />

    <!-- Form -->
    <div class="form">
      <input v-model="form.name" placeholder="Name" />
      <input v-model="form.brand" placeholder="Brand" />
      <input v-model="form.price" type="number" step="0.01" placeholder="Price" />
      <input v-model="form.stockQuantity" type="number" placeholder="Stock" />
      <input v-model="form.description" placeholder="Description" />
      <select v-model="form.categoryId">
        <option v-for="c in categories" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>

      <!-- Specs table -->
      <table class="specs">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in form.specs" :key="i">
            <td><input v-model="row.key" /></td>
            <td><input v-model="row.value" /></td>
            <td>
              <button @click="removeSpecRow(i)" v-if="form.specs.length > 1">✕</button>
            </td>
          </tr>
        </tbody>
      </table>

      <button @click="addSpecRow">+ Add row</button>

      <button class="save" @click="save">Save</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.images {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.image-box {
  position: relative;
}

.image-box img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.delete-img {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #b91c1c;
  border: none;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.specs input {
  width: 100%;
}

.save {
  padding: 10px 16px;
  background: #16a34a;
  border: none;
  color: black;
  border-radius: 6px;
  cursor: pointer;
}
</style>
