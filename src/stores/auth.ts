import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || '',
    email: localStorage.getItem('email') || '',
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'Admin',
  },

  actions: {
    login(token: string, role: string, email: string) {
      this.token = token
      this.role = role
      this.email = email

      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      localStorage.setItem('email', email)
    },

    logout() {
      this.token = ''
      this.role = ''
      this.email = ''

      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('email')
    },
  },
})
