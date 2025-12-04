import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'

const routes: RouteRecordRaw[] = [{ path: '/', name: 'home', component: HomePage }]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (to.meta.requiresAdmin && role !== 'Admin') {
    return next('/login')
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }
  next()
})

export default router
