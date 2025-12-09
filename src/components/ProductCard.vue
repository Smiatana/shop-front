<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

defineProps<{
  name: string
  price: number
  image?: string
}>()

const auth = useAuthStore()
</script>

<template>
  <div class="actions">
    <template v-if="auth.isAdmin">
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </template>

    <template v-else-if="auth.isAuthenticated">
      <button class="add-cart">Add to Cart</button>
      <button class="add-compare">Compare</button>
    </template>

    <template v-else>
      <router-link to="/login" class="login-required">Log in to buy</router-link>
    </template>
  </div>
</template>

<style scoped>
.product-card {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.product-img {
  height: 180px;
  background: #333;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  margin-bottom: 15px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
}

.actions button {
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition:
    background 0.2s,
    opacity 0.2s,
    transform 0.15s;
}

.actions .edit {
  background: var(--accent);
  color: white;
}

.actions .edit:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.actions .delete {
  background: #ff4d4d;
  color: white;
}

.actions .delete:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.actions .add-cart {
  background: var(--accent);
  color: white;
}

.actions .add-cart:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.actions .add-compare {
  background: var(--card-bg);
  border: 1px solid var(--accent);
  color: var(--accent);
}

.actions .add-compare:hover {
  background: var(--accent);
  color: white;
  transform: translateY(-1px);
}

.actions .login-required {
  padding: 8px 14px;
  border-radius: 8px;
  background: var(--accent);
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition:
    opacity 0.2s,
    transform 0.15s;
}

.actions .login-required:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
