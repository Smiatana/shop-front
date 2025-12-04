<template>
  <section class="hero">
    <div class="hero-content">
      <h1>Discover the Latest Tech</h1>
      <p>Premium devices. Smart prices. Fast delivery.</p>
      <button class="cta">Shop Now</button>
    </div>

    <div class="hero-image"></div>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  justify-content: space-between;
  padding: 80px 40px;
  align-items: center;
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
}

.cta:hover {
  background: var(--accent-dark);
}

.hero-image {
  width: 400px;
  height: 300px;
  background: var(--card-bg);
  border-radius: 20px;
}
</style>
