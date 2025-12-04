<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import LogoLink from '@/components/LogoLink.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

defineProps<{ theme: string }>()
defineEmits(['toggle-theme'])

const mobileOpen = ref(false)
</script>

<template>
  <header class="header">
    <div class="left">
      <LogoLink />
    </div>

    <div class="center">
      <input class="search" type="text" placeholder="Search products..." />
    </div>

    <div class="right">
      <nav class="nav desktop-nav">
        <router-link to="/products">Products</router-link>
        <router-link to="/categories">Categories</router-link>
        <router-link to="/deals">Deals</router-link>

        <!-- admin -->
        <template v-if="auth.isAdmin">
          <router-link to="/admin">Admin Panel</router-link>
        </template>

        <!-- logged in user -->
        <template v-else-if="auth.isAuthenticated">
          <router-link to="/cart">Cart</router-link>
          <router-link to="/comparisons">Comparisons</router-link>
          <router-link to="/orders">Orders</router-link>
          <router-link to="/profile">Profile</router-link>
        </template>

        <!-- guest -->
        <template v-else>
          <router-link to="/signin">Sign In</router-link>
        </template>
      </nav>

      <button class="theme-btn" @click="$emit('toggle-theme')">
        <Icon v-if="theme === 'light'" icon="mdi:weather-night" width="24" height="24" />
        <Icon v-else icon="mdi:white-balance-sunny" width="24" height="24" />
      </button>

      <button class="burger" @click="mobileOpen = !mobileOpen">
        <Icon icon="mdi:menu" width="28" height="28" />
      </button>
    </div>

    <transition name="slide">
      <nav v-if="mobileOpen" class="mobile-nav">
        <router-link @click="mobileOpen = false" to="/products">Products</router-link>
        <router-link @click="mobileOpen = false" to="/categories">Categories</router-link>
        <router-link @click="mobileOpen = false" to="/deals">Deals</router-link>

        <!-- admin -->
        <template v-if="auth.isAdmin">
          <router-link @click="mobileOpen = false" to="/admin">Admin Panel</router-link>
        </template>

        <!-- logged in user -->
        <template v-else-if="auth.isAuthenticated">
          <router-link @click="mobileOpen = false" to="/cart">Cart</router-link>
          <router-link @click="mobileOpen = false" to="/comparisons">Comparisons</router-link>
          <router-link @click="mobileOpen = false" to="/orders">Orders</router-link>
          <router-link @click="mobileOpen = false" to="/profile">Profile</router-link>
        </template>

        <!-- guest -->
        <template v-else>
          <router-link @click="mobileOpen = false" to="/signin">Sign In</router-link>
        </template>
      </nav>
    </transition>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--card-bg);
  position: relative;
}

.left {
  display: flex;
  align-items: center;
}

.center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.search {
  width: 60%;
  max-width: 450px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid var(--card-bg);
  background: var(--card-bg);
  color: var(--text);
  font-size: 15px;
  outline: none;
}

.search:focus {
  border-color: var(--accent);
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.desktop-nav {
  display: flex;
  gap: 24px;
}

.desktop-nav a {
  color: var(--text);
  opacity: 0.85;
  text-decoration: none;
  font-weight: 500;
}

.desktop-nav a:hover {
  opacity: 1;
}

.theme-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text);
  display: flex;
  align-items: center;
}

.burger {
  display: none;
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
}

.mobile-nav {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--bg);
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid var(--card-bg);
}

.mobile-nav a {
  display: none;
  text-align: end;
  color: var(--text);
  text-decoration: none;
  font-size: 18px;
  opacity: 0.9;
}

.mobile-nav a:hover {
  opacity: 1;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 900px) {
  .desktop-nav {
    display: none;
  }

  .burger {
    display: block;
  }
  .mobile-nav {
    display: block;
  }
  .mobile-nav a {
    display: block;
  }
}
</style>
