import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomePage from '@/pages/HomePage.vue'
import SignInPage from '@/pages/SignInPage.vue'
import UserProfilePage from '@/pages/UserProfilePage.vue'
import AdminLayout from '@/pages/admin/AdminLayout.vue'
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage.vue'
import AdminProductsPage from '@/pages/admin/AdminProductsPage.vue'
import ProductEditPage from '@/pages/admin/ProductEditPage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/signin', name: 'signin', component: SignInPage },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: 'categories', component: AdminCategoriesPage },
      { path: 'products', component: AdminProductsPage },
      {
        path: '/admin/products/:id/edit',
        component: ProductEditPage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next('/signin')
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/signin')
  }

  next()
})

export default router
