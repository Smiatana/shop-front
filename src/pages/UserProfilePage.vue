<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { UserProfile } from '@/types/user'

const auth = useAuthStore()
const router = useRouter()

const user = ref<UserProfile | null>(null)
const loading = ref(true)
const error = ref('')

const API_URL = import.meta.env.VITE_API_URL

onMounted(async () => {
  console.log('TOKEN:', auth.token)
  try {
    const res = await fetch(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })

    if (!res.ok) {
      error.value = 'Failed to load profile'
      return
    }

    user.value = await res.json()
  } finally {
    loading.value = false
  }
})

function goTo(path: string) {
  router.push(path)
}

function logout() {
  auth.logout()
  router.push('/signin')
}
</script>

<template>
  <div class="profile-page">
    <h1>Your Profile</h1>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="profile-card">
      <div class="info">
        <h2>{{ user?.name }}</h2>
        <p class="email">{{ user?.email }}</p>
      </div>

      <div class="actions">
        <button @click="goTo('/cart')">Your Cart</button>
        <button @click="goTo('/orders')">Your Orders</button>
        <button @click="goTo('/comparisons')">Comparisons</button>
        <button class="logout" @click="logout">Sign Out</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.profile-card {
  background: var(--card-bg);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.info {
  text-align: center;
  margin-bottom: 30px;
}

.info h2 {
  font-size: 26px;
  margin-bottom: 6px;
}

.info .email {
  opacity: 0.7;
  font-size: 15px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.actions button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: var(--accent);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.15s;
}

.actions button:hover {
  background: var(--accent-dark);
  transform: translateY(-2px);
}

.actions .logout {
  background: #ff4d4d;
}

.actions .logout:hover {
  background: #e63d3d;
}

.loading,
.error {
  text-align: center;
  margin-top: 20px;
  opacity: 0.8;
}
</style>
