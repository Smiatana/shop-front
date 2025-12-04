<template>
  <section class="categories">
    <h2>Categories</h2>

    <div class="category-grid">
      <div class="category-card">Phones</div>
      <div class="category-card">Laptops</div>
      <div class="category-card">Tablets</div>
      <div class="category-card">Accessories</div>
    </div>
  </section>
</template>

<style scoped>
.categories {
  padding: 40px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.category-card {
  background: var(--card-bg);
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.category-card:hover {
  transform: translateY(-4px);
}
</style>
