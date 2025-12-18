<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

type Slide = {
  image: string
  link: string
  title?: string
  subtitle?: string
}

const slides = ref<Slide[]>([
  {
    image: '/hero/slide1.jpg',
    link: '/category/1',
    title: 'Latest Smartphones',
    subtitle: 'Power. Speed. Style.',
  },
  {
    image: '/hero/slide2.jpg',
    link: '/category/2',
    title: 'High-End Laptops',
    subtitle: 'Work & Play Faster',
  },
  {
    image: '/hero/slide3.jpg',
    link: '/category/3',
    title: 'Tech Accessories',
    subtitle: 'Complete Your Setup',
  },
])

const active = ref(0)
let timer: number | null = null

function next() {
  active.value = (active.value + 1) % slides.value.length
}

function goTo(index: number) {
  active.value = index
}

onMounted(() => {
  timer = window.setInterval(next, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="hero">
    <div class="hero-content">
      <h1>{{ slides[active].title }}</h1>
      <p>{{ slides[active].subtitle }}</p>
      <a :href="slides[active].link" class="cta">Shop Now</a>
    </div>

    <div class="hero-slider">
      <a
        v-for="(slide, i) in slides"
        :key="i"
        :href="slide.link"
        class="slide"
        :class="{ active: i === active }"
        :style="{ backgroundImage: `url(${slide.image})` }"
      />
    </div>

    <div class="dots">
      <span v-for="(_, i) in slides" :key="i" :class="{ active: i === active }" @click="goTo(i)" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  justify-content: space-between;
  padding: 80px 40px;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 500px;
  z-index: 2;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 10px;
}

.hero-content p {
  color: var(--subtext);
  margin-bottom: 20px;
}

.cta {
  background: var(--accent);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  text-decoration: none;
}

.cta:hover {
  background: var(--accent-dark);
}

.hero-slider {
  position: relative;
  width: 420px;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
}

.slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.slide.active {
  opacity: 1;
}

.dots {
  position: absolute;
  bottom: 20px;
  right: 40px;
  display: flex;
  gap: 8px;
}

.dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #aaa;
  cursor: pointer;
  transition: background 0.2s;
}

.dots span.active {
  background: var(--accent);
}

@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    gap: 30px;
  }

  .hero-slider {
    width: 100%;
    height: 240px;
  }
}
</style>
