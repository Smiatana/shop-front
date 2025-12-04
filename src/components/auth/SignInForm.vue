<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const auth = useAuthStore()

async function login() {
  error.value = ''

  const API_URL = import.meta.env.VITE_API_URL

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value, password: password.value }),
  })

  const data = await res.json()
  const token = data.token

  const payload = JSON.parse(atob(token.split('.')[1]))
  const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
  const emailClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']

  auth.login(token, role, emailClaim)

  window.location.href = '/'
}
</script>

<template>
  <form class="auth-form" @submit.prevent="login">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />

    <button type="submit">Sign In</button>

    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-form input {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--card-bg);
  background: var(--card-bg);
  color: var(--text);
  font-size: 15px;
  outline: none;
  transition:
    border 0.2s,
    background 0.2s;
}

.auth-form input:focus {
  border-color: var(--accent);
}

.auth-form button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: var(--accent);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.auth-form button:hover {
  background: var(--accent-dark);
}

.error {
  color: #ff5252;
  font-size: 14px;
  margin-top: 4px;
}
</style>
