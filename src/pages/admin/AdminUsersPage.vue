<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authFetch } from '@/utils/authFetch'

interface User {
  id: number
  email: string
  role: string
  isBanned: boolean
}

const users = ref<User[]>([])

async function fetchUsers() {
  const res = await authFetch('/api/users')
  users.value = await res.json()
}

async function changeRole(user: User) {
  const newRole = user.role === 'Admin' ? 'User' : 'Admin'
  await authFetch(`/api/users/${user.id}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newRole }),
  })
  user.role = newRole
}

async function changePassword(user: User) {
  const newPassword = prompt(`Enter new password for ${user.email}:`)
  if (!newPassword) return
  await authFetch(`/api/users/${user.id}/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newPassword }),
  })
  alert('Password changed!')
}

async function banUser(user: User) {
  if (!confirm(`Ban user ${user.email}?`)) return
  await authFetch(`/api/users/${user.id}`, { method: 'DELETE' })
  user.isBanned = true
}

onMounted(fetchUsers)
</script>

<template>
  <div class="page">
    <h1 class="page-title">User Management</h1>
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.isBanned ? 'Banned' : 'Active' }}</td>
          <td>
            <button @click="changeRole(user)">Switch Role</button>
            <button @click="changePassword(user)">Change Password</button>
            <button @click="banUser(user)" :disabled="user.isBanned">Ban</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
  border: 1px solid #ccc;
}
button {
  margin-right: 6px;
  padding: 4px 8px;
}
</style>
