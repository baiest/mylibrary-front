<template>
  <nav>
    <ul class="container">
      <li><router-link :to="{ name: 'home' }">Home</router-link></li>
      <li><router-link :to="{ name: 'new' }">New</router-link></li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  padding: 10px 8px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  background: #000;
}
ul {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  list-style: none;
}
</style>
