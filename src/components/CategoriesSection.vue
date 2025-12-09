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

@media (max-width: 900px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .category-grid {
    grid-template-columns: 1fr;
  }

  .category-card {
    padding: 28px;
    font-size: 18px;
  }
}
</style>
