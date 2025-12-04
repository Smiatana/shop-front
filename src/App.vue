<script setup lang="ts"></script>

<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/products">Products</router-link>
        <router-link to="/cart">Cart</router-link>
        <router-link to="/orders">Orders</router-link>
        <router-link to="/comparisons">Comparisons</router-link>
        <router-link to="/admin">Admin Panel</router-link>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <p>footer</p>
    </footer>
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
}

header nav {
  display: flex;
  gap: 1rem;
  background: #333;
  padding: 1rem;
}

header nav a {
  color: white;
  text-decoration: none;
}

header nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}

main {
  padding: 1rem;
}
</style>
