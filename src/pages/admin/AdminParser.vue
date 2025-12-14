<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authFetch } from '@/utils/authFetch'
import type { Category } from '@/types/category'
import { imageUrl } from '@/utils/imageUrl'

const url = ref('https://catalog.onliner.by/mobile')
const pageFrom = ref(1)
const pageTo = ref(1)
const categoryId = ref<number | null>(null)
const categories = ref<Category[]>([])

const loading = ref(false)
const error = ref<string | null>(null)

const scraped = ref<any[]>([])
const importing = ref(false)

async function loadCategories() {
  const res = await authFetch('/api/categories')
  if (!res.ok) return
  categories.value = await res.json()
  if (categories.value.length) categoryId.value = categories.value[0].id
}

async function startScrape() {
  error.value = null
  scraped.value = []
  loading.value = true

  try {
    const body = {
      url: url.value,
      pageFrom: pageFrom.value,
      pageTo: pageTo.value,
      categoryId: categoryId.value,
      saveToDb: false,
    }

    const res = await authFetch('/api/scraper/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      error.value = await res.text()
      loading.value = false
      return
    }

    const data = await res.json()

    scraped.value = data.map((p: any) => ({
      ...p,
      selected: true,
      collapsed: true,
    }))
  } catch (ex: any) {
    error.value = ex.message || String(ex)
  } finally {
    loading.value = false
  }
}

async function importSelected() {
  const selectedProducts = scraped.value
    .filter((p) => p.selected)
    .map((p) => ({
      product: p.product,
      remoteImageUrls: p.images,
    }))

  if (selectedProducts.length === 0) {
    alert('No products selected.')
    return
  }

  importing.value = true
  error.value = null

  try {
    const res = await authFetch('/api/scraper/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryId: categoryId.value,
        products: selectedProducts,
      }),
    })

    if (!res.ok) {
      error.value = await res.text()
      importing.value = false
      return
    }

    alert('Imported successfully!')
    scraped.value = []
  } catch (ex: any) {
    error.value = ex.message || String(ex)
  } finally {
    importing.value = false
  }
}

onMounted(loadCategories)
</script>

<template>
  <div class="parser-page">
    <h1>📦 Product Scraper</h1>

    <div class="scrape-card">
      <div class="form-grid">
        <label>
          <span>Catalog URL</span>
          <input v-model="url" placeholder="https://catalog.onliner.by/mobile" />
        </label>

        <label>
          <span>Page from</span>
          <input type="number" v-model.number="pageFrom" min="1" />
        </label>

        <label>
          <span>Page to</span>
          <input type="number" v-model.number="pageTo" :min="pageFrom" />
        </label>

        <label>
          <span>Assign category</span>
          <select v-model.number="categoryId">
            <option v-for="c in categories" :value="c.id" :key="c.id">
              {{ c.name }}
            </option>
          </select>
        </label>
      </div>

      <button class="scrape-btn" @click="startScrape" :disabled="loading">
        {{ loading ? 'Parsing…' : 'Start Parse' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <div v-if="scraped.length" class="results">
      <h2>Parsed products ({{ scraped.length }})</h2>

      <div class="product-grid">
        <div v-for="(item, i) in scraped" :key="i" class="product-card">
          <div class="top-line">
            <input type="checkbox" v-model="item.selected" />
            <span class="product-name">{{ item.product.name }}</span>

            <button @click="item.collapsed = !item.collapsed" class="toggle-details-btn">
              {{ item.collapsed ? 'Show Details' : 'Hide Details' }}
            </button>
          </div>

          <div class="thumb">
            <img v-if="item.images?.length" :src="item.images[0]" alt="preview" />
            <div v-else class="no-image">No image</div>
          </div>

          <div v-show="!item.collapsed" class="details">
            <div class="detail"><strong>Brand:</strong> {{ item.product.brand }}</div>
            <div class="detail"><strong>Price:</strong> {{ item.product.price }}</div>
            <div class="detail"><strong>Images:</strong> {{ item.images?.length }}</div>
            <div class="detail"><strong>Description:</strong> {{ item.product.description }}</div>

            <details class="specs">
              <summary>Specs</summary>
              <pre>{{ JSON.stringify(item.product.specs, null, 2) }}</pre>
            </details>
          </div>
        </div>
      </div>
      <button class="import-btn" :disabled="importing" @click="importSelected">
        {{ importing ? 'Importing…' : 'Import Selected Products' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* --- LAYOUT --- */
.parser-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
  box-sizing: border-box;
  flex: 1 0 auto;
}

/* Headings */
h1 {
  font-size: 28px;
  margin-bottom: 12px;
  color: var(--text);
}

/* --- SCRAPER CARD --- */
.scrape-card {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: var(--text);
}

input,
select {
  padding: 8px;
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--subtext);
  border-radius: 6px;
}

.scrape-btn,
.import-btn {
  align-self: flex-start;
  padding: 10px 16px;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.scrape-btn {
  background: var(--accent);
}
.scrape-btn:hover:not(:disabled) {
  background: var(--accent-dark);
}
.scrape-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.import-btn {
  background: var(--accent);
  margin-top: 16px;
}
.import-btn:hover:not(:disabled) {
  background: var(--accent-dark);
}
.import-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  color: #ef4444;
}

/* --- PRODUCTS GRID --- */
.results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
  overflow: visible;
}

.product-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-name {
  font-weight: bold;
}

.thumb {
  height: 140px;
  background: var(--bg);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.no-image {
  font-size: 14px;
  opacity: 0.5;
}

.details {
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--text);
}

.specs summary {
  cursor: pointer;
  margin-bottom: 6px;
  font-weight: bold;
}

/* --- FOOTER SPACING --- */
.parser-page {
  padding-bottom: 80px; /* ensure footer doesn’t overlap content */
}

.toggle-details-btn {
  margin-left: auto;
  padding: 4px 8px;
  font-size: 12px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle-details-btn:hover {
  background: var(--accent-dark);
}

/* --- RESPONSIVENESS --- */
@media (max-width: 600px) {
  .thumb {
    height: 120px;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
