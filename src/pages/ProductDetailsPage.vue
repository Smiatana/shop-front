<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authFetch } from '@/utils/authFetch'
import { imageUrl } from '@/utils/imageUrl'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const product = ref<any | null>(null)
const selectedImage = ref<string | null>(null)

async function loadProduct() {
  const res = await authFetch(`/api/products/${route.params.id}`)
  if (!res.ok) {
    router.push('/products')
    return
  }

  product.value = await res.json()
  selectedImage.value = product.value.images?.[0]?.url ?? null
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
            <button class="add-cart">Add to Cart</button>
            <button class="add-compare">Compare</button>
          </template>

          <template v-else>
            <router-link to="/signin" class="login-required"> Sign in to buy </router-link>
          </template>
        </div>
      </div>
    </div>

    <!-- 🔹 DESCRIPTION -->
    <section class="section">
      <h2>Description</h2>
      <p>{{ product.description }}</p>
    </section>

    <!-- 🔹 SPECS -->
    <section v-if="product.specs" class="section">
      <h2>Specifications</h2>

      <table class="specs">
        <tr v-for="(value, key) in product.specs" :key="key">
          <th>{{ key }}</th>
          <td>{{ value }}</td>
        </tr>
      </table>
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
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.gallery {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.main-image {
  height: 360px;
  background: var(--card-bg);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.thumbs {
  display: flex;
  gap: 10px;
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

@media (max-width: 900px) {
  .top {
    grid-template-columns: 1fr;
  }
}
</style>
