<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { authFetch } from '@/utils/authFetch'
import { imageUrl } from '@/utils/imageUrl'

const auth = useAuthStore()
const router = useRouter()

const user = ref<any | null>(null)
const reviews = ref<any[]>([])

const loading = ref(true)
const saving = ref(false)
const error = ref('')

const name = ref('')
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)

async function loadProfile() {
  const res = await authFetch('/api/users/me')
  if (!res.ok) {
    error.value = 'Failed to load profile'
    return
  }

  user.value = await res.json()
  name.value = user.value.name

  const avatar = user.value.images?.find((i: any) => i.position === 0)
  avatarPreview.value = avatar ? imageUrl(avatar.url) : null
}

async function loadReviews() {
  const res = await authFetch('/api/reviews/me')
  if (res.ok) {
    reviews.value = await res.json()
  }
}

function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

async function saveProfile() {
  saving.value = true
  error.value = ''

  try {
    const form = new FormData()
    form.append('name', name.value)
    if (avatarFile.value) {
      form.append('avatar', avatarFile.value)
    }

    const res = await authFetch('/api/users/me', {
      method: 'PUT',
      body: form,
    })

    if (!res.ok) {
      error.value = 'Failed to save profile'
      return
    }

    await loadProfile()
  } finally {
    saving.value = false
  }
}

function goTo(path: string) {
  router.push(path)
}

function logout() {
  auth.logout()
  router.push('/signin')
}

onMounted(async () => {
  try {
    await loadProfile()
    await loadReviews()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="profile-page">
    <h1>Your Profile</h1>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="profile-grid">
      <!-- 🔹 PROFILE CARD -->
      <div class="profile-card">
        <div class="avatar">
          <img v-if="avatarPreview" :src="avatarPreview" alt="Profile picture" />
          <div v-else class="placeholder">?</div>
        </div>

        <label class="upload">
          Change photo
          <input type="file" accept="image/*" @change="onAvatarChange" />
        </label>

        <input v-model="name" class="input" placeholder="Your name" />

        <button class="save" :disabled="saving" @click="saveProfile">
          {{ saving ? 'Saving...' : 'Save changes' }}
        </button>

        <div class="actions">
          <button @click="goTo('/cart')">Your Cart</button>
          <button @click="goTo('/orders')">Your Orders</button>
          <button @click="goTo('/comparisons')">Comparisons</button>
          <button class="logout" @click="logout">Sign Out</button>
        </div>
      </div>

      <!-- 🔹 REVIEWS -->
      <div class="reviews-card">
        <h2>Your Reviews</h2>

        <div v-if="!reviews.length" class="empty">You haven’t written any reviews yet.</div>

        <div v-for="r in reviews" :key="r.id" class="review">
          <div class="rating">⭐ {{ r.rating }}/5</div>
          <h3>{{ r.title }}</h3>
          <p>{{ r.body }}</p>

          <div class="product">
            Review for:
            <router-link :to="`/products/${r.productId}`" class="product-link">
              {{ r.productName }}
            </router-link>
          </div>

          <div v-if="r.images?.length" class="review-images">
            <img v-for="img in r.images" :key="img" :src="imageUrl(img)" class="review-image" />
          </div>

          <div class="date">
            {{ new Date(r.createdAt).toLocaleDateString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 1100px;
  margin: 40px auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 32px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 32px;
}

.profile-card,
.reviews-card {
  background: var(--card-bg);
  padding: 28px;
  border-radius: 16px;
}

.avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 12px;
  border-radius: 50%;
  overflow: hidden;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  font-size: 48px;
  color: #777;
}

.upload {
  display: block;
  text-align: center;
  color: var(--accent);
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 16px;
}

.upload input {
  display: none;
}

.input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #333;
  background: transparent;
  color: inherit;
  margin-bottom: 12px;
}

.save {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: var(--accent);
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.actions button {
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: var(--accent-dark);
  color: white;
  cursor: pointer;
}

.actions .logout {
  background: #ff4d4d;
}

.reviews-card h2 {
  margin-bottom: 16px;
}

.review {
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 14px;
}

.review h3 {
  margin: 6px 0;
}

.rating {
  color: var(--accent);
  font-weight: 600;
}

.date {
  font-size: 12px;
  opacity: 0.6;
  margin-top: 6px;
}

.empty {
  opacity: 0.6;
  font-style: italic;
}

.loading,
.error {
  text-align: center;
  margin-top: 20px;
}

.product {
  font-size: 13px;
  opacity: 0.75;
  margin-bottom: 6px;
}

.product-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
}

.product-link:hover {
  text-decoration: underline;
}

.review-images {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.review-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

@media (max-width: 900px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
