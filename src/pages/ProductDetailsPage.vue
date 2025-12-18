<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authFetch } from '@/utils/authFetch'
import { imageUrl } from '@/utils/imageUrl'
import ProductReviews from '@/components/products/ProductReviews.vue'
import type { Product } from '@/types/product'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const product = ref<Product | null>(null)
const selectedImage = ref<string | null>(null)
const comparing = ref(false)

const activeTab = ref<'description' | 'specs' | 'reviews'>('description')

async function loadProduct() {
  const res = await authFetch(`/api/products/${route.params.id}`)
  if (!res.ok) {
    router.push('/products')
    return
  }

  product.value = await res.json()
  selectedImage.value = product.value.images?.[0]?.url ?? null
}

async function addToCart() {
  if (!product.value) return

  await authFetch(`/api/cart/items?productId=${product.value.id}&quantity=1`, { method: 'POST' })
}

async function addToCompare() {
  if (!product.value || comparing.value) return

  comparing.value = true

  await authFetch(`/api/comparisons/add/${product.value.id}`, {
    method: 'POST',
  })

  comparing.value = false

  router.push(`/comparisons/${product.value.categoryId}`)
}

onMounted(loadProduct)
</script>

<template>
  <div v-if="product" class="page">
    <!-- 🔹 TOP -->
    <div class="top">
      <!-- Images -->
      <div class="gallery">
        <div class="main-image">
          <img v-if="selectedImage" :src="imageUrl(selectedImage)" :alt="product.name" />
        </div>

        <div class="thumbs">
          <img
            v-for="img in product.images"
            :key="img.id"
            :src="imageUrl(img.url)"
            :class="{ active: img.url === selectedImage }"
            @click="selectedImage = img.url"
          />
        </div>
      </div>

      <!-- Info -->
      <div class="details">
        <h1>{{ product.name }}</h1>
        <div class="brand">{{ product.brand }}</div>

        <div class="price">{{ product.price }} BYN</div>

        <!-- ACTIONS -->
        <div class="actions">
          <template v-if="auth.isAdmin">
            <router-link :to="`/admin/products/${product.id}/edit`" class="edit">
              Edit
            </router-link>
            <button class="delete">Delete</button>
          </template>

          <template v-else-if="auth.isAuthenticated">
            <button class="add-cart" @click="addToCart">Add to Cart</button>
            <button class="add-compare" :disabled="comparing" @click="addToCompare">
              {{ comparing ? 'Added to comparison' : 'Compare' }}
            </button>
          </template>

          <template v-else>
            <router-link to="/signin" class="login-required"> Sign in to buy </router-link>
          </template>
        </div>
      </div>
    </div>
    <div class="tabs">
      <button :class="{ active: activeTab === 'description' }" @click="activeTab = 'description'">
        Description
      </button>

      <button :class="{ active: activeTab === 'specs' }" @click="activeTab = 'specs'">Specs</button>

      <button :class="{ active: activeTab === 'reviews' }" @click="activeTab = 'reviews'">
        Reviews
      </button>
    </div>

    <section v-if="activeTab === 'description'" class="section">
      <h2>Description</h2>
      <p>{{ product.description }}</p>
    </section>

    <section v-if="activeTab === 'specs'" class="section">
      <h2>Specifications</h2>
      <table class="specs">
        <tr v-for="(value, key) in product.specs" :key="key">
          <th>{{ key }}</th>
          <td>{{ value }}</td>
        </tr>
      </table>
    </section>

    <section v-if="activeTab === 'reviews'" class="section">
      <ProductReviews :productId="product.id" />
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.top {
  display: grid;
  grid-template-columns: minmax(250px, 40%) 1fr;
  gap: 32px;
  align-items: start;
}

.gallery {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 100%;
}

.main-image {
  height: 360px;
  background: var(--card-bg);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.main-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.thumbs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.thumbs img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 8px;
  background: var(--card-bg);
  cursor: pointer;
  opacity: 0.6;
  border: 2px solid transparent;
}

.thumbs img.active {
  opacity: 1;
  border-color: var(--accent);
}

.details h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.brand {
  color: var(--subtext);
  margin-bottom: 16px;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.actions a,
.actions button {
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.edit,
.add-cart,
.login-required {
  background: var(--accent);
  color: #fff;
}

.delete {
  background: #ff4d4d;
  color: #fff;
}

.add-compare {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
}
.add-compare:disabled {
  opacity: 0.6;
  cursor: default;
}

.section {
  margin-top: 40px;
}

.section h2 {
  font-size: 20px;
  margin-bottom: 12px;
}

.specs {
  width: 100%;
  border-collapse: collapse;
}

.specs th,
.specs td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--card-bg);
  text-align: left;
}

.specs th {
  width: 30%;
  color: var(--subtext);
}

.tabs {
  display: flex;
  gap: 12px;
  margin: 32px 0;
  border-bottom: 1px solid var(--card-bg);
}

.tabs button {
  background: none;
  border: none;
  padding: 10px 4px;
  font-size: 15px;
  cursor: pointer;
  color: var(--subtext);
  position: relative;
}

.tabs button.active {
  color: var(--accent);
  font-weight: 600;
}

.tabs button.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 2px;
  background: var(--accent);
}

@media (max-width: 900px) {
  .top {
    grid-template-columns: 1fr;
  }
}
</style>
