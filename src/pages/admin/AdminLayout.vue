<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/signin')
}
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h2>Admin</h2>

      <RouterLink to="/admin/categories">Categories</RouterLink>
      <RouterLink to="/admin/products">Products</RouterLink>
      <RouterLink to="/admin/discounts">Discounts</RouterLink>
      <RouterLink to="/admin/parsing">Parsing</RouterLink>
      <RouterLink to="/admin/orders">Orders</RouterLink>
      <RouterLink to="/admin/users">Users</RouterLink>
      <RouterLink to="/admin/sliders">Sliders</RouterLink>

      <button class="logout" @click="logout">Log out</button>
    </aside>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
}

.sidebar {
  width: 220px;
  background: var(--card-bg);
  color: var(--text);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar a {
  color: var(--text);
  text-decoration: none;
}

.logout {
  border-radius: 10px;
  margin-top: auto;
  background: var(--bg);
  color: var(--subtext);
  border: none;
  padding: 8px;
  cursor: pointer;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>
