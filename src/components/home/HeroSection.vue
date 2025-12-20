<script setup lang="ts">
import { authFetch } from '@/utils/authFetch'
import { imageUrl } from '@/utils/imageUrl'
import { ref, onMounted, onUnmounted } from 'vue'

type Slide = {
  id: number
  title?: string
  subtitle?: string
  link?: string
  image?: {
    url: string
  }
}

const slides = ref<Slide[]>([])
const active = ref(0)
let timer: number | null = null

async function loadSlides() {
  const res = await authFetch('/api/sliders')
  slides.value = await res.json()
}

function next() {
  if (slides.value.length === 0) return
  active.value = (active.value + 1) % slides.value.length
}

function goTo(index: number) {
  active.value = index
}

onMounted(async () => {
  await loadSlides()
  timer = window.setInterval(next, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="hero">
    <a class="hero-link" :href="slides[active]?.link || undefined">
      <div
        class="hero-background"
        :style="{
          backgroundImage: slides[active]?.image
            ? `url(${imageUrl(slides[active].image.url)})`
            : undefined,
        }"
      />
      <div class="hero-content" v-if="slides[active]">
        <h1 v-if="slides[active].title">{{ slides[active].title }}</h1>
        <p v-if="slides[active].subtitle">{{ slides[active].subtitle }}</p>
      </div>
    </a>

    <div class="dots">
      <span
        v-for="(_, i) in slides"
        :key="i"
        :class="{ active: i === active }"
        @click.stop="goTo(i)"
      />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-link {
  position: relative;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.5);
  transition: background-image 0.5s ease;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
}

.hero-content h1 {
  font-size: 64px;
  margin-bottom: 16px;
}

.hero-content p {
  font-size: 24px;
  color: #eee;
}

.dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
}

.dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #aaa;
  cursor: pointer;
  transition: background 0.3s;
}

.dots span.active {
  background: var(--accent);
}

@media (max-width: 900px) {
  .hero {
    height: 400px;
  }

  .hero-content h1 {
    font-size: 36px;
  }

  .hero-content p {
    font-size: 18px;
  }
}
</style>
