<script setup lang="ts">
import { ref } from 'vue'
import MainHeader from '@/components/MainHeader.vue'
import MainFooter from '@/components/MainFooter.vue'

const theme = ref(localStorage.getItem('theme') || 'light')

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}
</script>

<template>
  <div :class="['app', theme]">
    <MainHeader :theme="theme" @toggle-theme="toggleTheme" />

    <main>
      <router-view />
    </main>

    <MainFooter />
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.app.light {
  --bg: #ffffff;
  --text: #111111;
  --subtext: #444444;
  --card-bg: #f5f5f5;
  --accent: #00c853;
  --accent-dark: #009624;
}

.app.dark {
  --bg: #0d0d0d;
  --text: #f0f0f0;
  --subtext: #bbbbbb;
  --card-bg: #1a1a1a;
  --accent: #00e676;
  --accent-dark: #00c853;
}

.app.admin {
  --bg: #1a1a1a;
  --text: #ff8c00;
  --subtext: #ccc;
  --card-bg: #2a2a2a;
  --accent: #ff8c00;
  --accent-dark: #cc7000;
}

.app {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  background: var(--bg);
  color: var(--text);
  font-family:
    'Montserrat',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  transition:
    background 0.3s,
    color 0.3s;
}
main {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
}

footer {
  flex-shrink: 0;
}
</style>
