<script setup lang="ts">
import { ref } from 'vue'
import SignInForm from '../components/auth/SignInForm.vue'
import SignUpForm from '../components/auth/SignUpForm.vue'

const mode = ref<'signin' | 'signup'>('signin')
</script>

<template>
  <div class="auth-page">
    <div class="switcher">
      <button :class="{ active: mode === 'signin' }" @click="mode = 'signin'">Sign In</button>
      <button :class="{ active: mode === 'signup' }" @click="mode = 'signup'">Sign Up</button>
    </div>

    <SignInForm v-if="mode === 'signin'" />
    <SignUpForm v-else />
  </div>
</template>

<style scoped>
.auth-page {
  max-width: 420px;
  margin: 60px auto;
  padding: 30px;
  background: var(--card-bg);
  border-radius: 12px;
}

.switcher {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.switcher button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: var(--card-bg);
  color: var(--text);
  opacity: 0.7;
}

.switcher button.active {
  background: var(--accent);
  color: white;
  opacity: 1;
}
</style>
