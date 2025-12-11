<script setup lang="ts">
import { reactive } from 'vue'
import { authFetch } from '@/utils/authFetch'

const props = defineProps<{
  categoryId: number
}>()

const emit = defineEmits<{
  created: []
}>()

const form = reactive({
  name: '',
  brand: '',
  price: '' as string,
  description: '',
  stockQuantity: '' as string,
  specs: [{ key: '', value: '' }] as { key: string; value: string }[],
  images: [] as File[],
})

function reset() {
  form.name = ''
  form.brand = ''
  form.price = ''
  form.description = ''
  form.stockQuantity = ''
  form.specs = []
  form.images = []
}

function onImagesSelected(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files) {
    form.images = Array.from(target.files)
  }
}

function addSpecRow() {
  form.specs.push({ key: '', value: '' })
}

function removeSpecRow(index: number) {
  form.specs.splice(index, 1)
}

function buildSpecsJson() {
  const obj: Record<string, unknown> = {}

  for (const row of form.specs) {
    const key = row.key.trim()
    const value = row.value.trim()

    if (!key && !value) continue

    if (!key || !value) {
      throw new Error('Each spec row must have both key and value.')
    }

    const num = Number(value)
    obj[key] = isNaN(num) ? value : num
  }

  return JSON.stringify(obj)
}

async function submit() {
  const fd = new FormData()
  fd.append('CategoryId', String(props.categoryId))
  fd.append('Name', form.name)
  fd.append('Brand', form.brand)
  fd.append('Price', form.price || '0')
  fd.append('Description', form.description)
  fd.append('StockQuantity', form.stockQuantity || '0')

  try {
    fd.append('Specs', buildSpecsJson())
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Invalid specs')
    return
  }

  for (const img of form.images) {
    fd.append('Images', img)
  }

  const res = await authFetch('/api/products/with-images', {
    method: 'POST',
    body: fd,
  })
  if (!res.ok) return

  reset()
  emit('created')
}
</script>

<template>
  <form class="form" @submit.prevent="submit">
    <input v-model="form.name" placeholder="Product name" required />
    <input v-model="form.brand" placeholder="Brand" />
    <input v-model="form.price" type="number" step="0.01" placeholder="Price" />
    <input v-model="form.stockQuantity" type="number" placeholder="Stock" />
    <input v-model="form.description" placeholder="Short description" />
    <div class="specs-table">
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, i) in form.specs" :key="i">
            <td>
              <input v-model="row.key" placeholder="e.g. CPU" />
            </td>

            <td>
              <input v-model="row.value" placeholder="e.g. AMD Ryzen 5 5600" />
            </td>

            <td>
              <button type="button" @click="removeSpecRow(i)" v-if="form.specs.length > 1">
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <button type="button" @click="addSpecRow">+ Add row</button>
    </div>
    <input type="file" accept="image/*" multiple @change="onImagesSelected" />
    <button type="submit">Add product</button>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}

.form input,
.form textarea {
  padding: 8px 10px;
  border-radius: 4px;
  background: var(--card-bg);
  outline: none;
  border: none;
  color: var(text);
  font-size: 14px;
}

.form textarea {
  min-height: 60px;
  flex: 1 0 100%;
  resize: vertical;
}

.form button {
  padding: 8px 14px;
  border-radius: 4px;
  border: none;
  background: #16a34a;
  color: #000;
  font-weight: 500;
  cursor: pointer;
}

.specs-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

.specs-table th,
.specs-table td {
  padding: 6px;
}

.specs-table input {
  width: 100%;
  padding: 6px 8px;
  border-radius: 4px;
  border: none;
  background: var(--card-bg);
  color: var(--text);
}
</style>
