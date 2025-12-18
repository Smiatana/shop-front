<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authFetch } from '@/utils/authFetch'
import { imageUrl } from '@/utils/imageUrl'

const props = defineProps<{
  id: number
  name: string
  price: number
  discountedPrice?: number
  discountPercentage?: number
  image?: string
}>()

const auth = useAuthStore()
const comparing = ref(false)

async function addToCart() {
  await authFetch(`/api/cart/items?productId=${props.id}&quantity=1`, {
    method: 'POST',
  })
}

async function addToCompare() {
  if (comparing.value) return
  comparing.value = true

  await authFetch(`/api/comparisons/add/${props.id}`, {
    method: 'POST',
  })

  comparing.value = false
}
</script>

<template>
  <div class="product-card" @click="$router.push(`/products/${id}`)">
    <div class="product-img">
      <img v-if="image" :src="imageUrl(image)" :alt="name" loading="lazy" />

      <div v-else class="img-placeholder">No image</div>

      <span v-if="discountPercentage" class="discount-badge"> -{{ discountPercentage }}% </span>
    </div>

    <div class="info">
      <h3 class="name">{{ name }}</h3>
      <div class="price">
        <template v-if="discountedPrice != price">
          <span class="old">{{ price }} BYN</span>
          <span class="new">{{ discountedPrice }} BYN</span>
        </template>
        <template v-else>
          <span class="new">{{ price }} BYN</span>
        </template>
      </div>
    </div>

    <div class="actions" @click.stop>
      <template v-if="auth.isAdmin">
        <router-link :to="`/admin/products/${id}/edit`" class="edit">Edit</router-link>
        <button class="delete">Delete</button>
      </template>
      <template v-else-if="auth.isAuthenticated">
        <button class="add-cart" @click="addToCart">Add to Cart</button>
        <button class="add-compare" :disabled="comparing" @click.stop="addToCompare">
          {{ comparing ? 'Added' : 'Compare' }}
        </button>
      </template>
      <template v-else>
        <router-link to="/signin" class="login-required">Sign in to buy</router-link>
      </template>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-img {
  position: relative;
  height: 200px;
  background: color-mix(in srgb, var(--bg) 90%, var(--text) 5%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.img-placeholder {
  font-size: 14px;
  color: var(--subtext);
}

.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #f59e0b;
  color: black;
  font-weight: 700;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 8px;
}

.info {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.3;
}

.price {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.price .old {
  text-decoration: line-through;
  color: var(--subtext);
  font-size: 13px;
}

.price .new {
  font-weight: 700;
  color: var(--accent);
  font-size: 15px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  flex-wrap: wrap;
}

.add-compare:disabled {
  opacity: 0.6;
  cursor: default;
}

.actions button,
.actions a {
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.actions .edit,
.actions .add-cart,
.actions .login-required {
  background: var(--accent);
  color: white;
}

.actions .delete {
  background: #ff4d4d;
  color: white;
}

.actions .add-compare {
  background: var(--card-bg);
  border: 1px solid var(--accent);
  color: var(--accent);
}

.actions button:hover,
.actions a:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
</style>
