import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomePage from '@/pages/HomePage.vue'
import SignInPage from '@/pages/SignInPage.vue'
import UserProfilePage from '@/pages/UserProfilePage.vue'
import AdminLayout from '@/pages/admin/AdminLayout.vue'
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage.vue'
import AdminProductsPage from '@/pages/admin/AdminProductsPage.vue'
import ProductEditPage from '@/pages/admin/ProductEditPage.vue'
import AdminParser from '@/pages/admin/AdminParser.vue'
import AdminDiscountsPage from '@/pages/admin/AdminDiscountsPage.vue'
import DiscountCreatePage from '@/pages/admin/DiscountCreatePage.vue'
import AdminUsersPage from '@/pages/admin/AdminUsersPage.vue'
import ProductsPage from '@/pages/ProductsPage.vue'
import CategoryEditPage from '@/pages/admin/CategoryEditPage.vue'
import ProductDetailsPage from '@/pages/ProductDetailsPage.vue'
import CartPage from '@/pages/CartPage.vue'
import OrdersPage from '@/pages/OrdersPage.vue'
import ComparisonCategoryPage from '@/pages/ComparisonCategoryPage.vue'
import ComparisonsPage from '@/pages/ComparisonsPage.vue'
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage.vue'
import AdminSliderPage from '@/pages/admin/AdminSliderPage.vue'
import AdminImages from '@/pages/admin/AdminImages.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage },
  {
    path: '/products',
    name: 'products',
    component: ProductsPage,
  },
  {
    path: '/products/:id',
    name: 'product-details',
    component: ProductDetailsPage,
  },
  { path: '/signin', name: 'signin', component: SignInPage },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrdersPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/comparisons',
    component: ComparisonsPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/comparisons/:categoryId',
    component: ComparisonCategoryPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: 'categories', component: AdminCategoriesPage },
      { path: 'categories/:id/edit', component: CategoryEditPage },
      { path: 'products', component: AdminProductsPage },
      { path: 'parsing', component: AdminParser },
      {
        path: '/admin/products/:id/edit',
        component: ProductEditPage,
      },
      { path: 'discounts', component: AdminDiscountsPage },
      { path: 'discounts/create', component: DiscountCreatePage },
      { path: 'users', component: AdminUsersPage },
      { path: 'orders', component: AdminOrdersPage },
      { path: 'sliders', component: AdminSliderPage },
      { path: 'images', component: AdminImages },
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
