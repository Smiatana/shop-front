<script setup lang="ts"></script>

<template>
  <router-link to="/" class="logo">
    <img src="/logo.svg" alt="ŠTEKIER logo" class="logo-icon" />
    <span class="logo-text">ŠTEKIER</span>
  </router-link>
</template>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text);
}

.logo-icon {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 1px;
}
</style>
