<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const name = ref('')
const error = ref('')
const success = ref('')

async function register() {
  error.value = ''
  success.value = ''

  const params = new URLSearchParams({
    email: email.value,
    password: password.value,
    name: name.value,
  })

  const API_URL = import.meta.env.VITE_API_URL

  const res = await fetch(`${API_URL}/api/auth/register?` + params.toString(), {
    method: 'POST',
  })

  if (!res.ok) {
    error.value = 'User already exists'
    return
  }

  success.value = 'Registered successfully. You can now log in.'
}
</script>

<template>
  <form class="auth-form" @submit.prevent="register">
    <input v-model="name" type="text" placeholder="Name" required />
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />

    <button type="submit">Sign Up</button>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
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

.success {
  color: #00c853;
  font-size: 14px;
  margin-top: 4px;
}
</style>
