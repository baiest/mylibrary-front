<template>
  <nav>
    <ul class="container">
      <li>
        <router-link :active-class="'active'" :to="{ name: 'home' }"
          >Home</router-link
        >
      </li>
      <li>
        <router-link :active-class="'active'" :to="{ name: 'new' }"
          >New</router-link
        >
      </li>
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
  z-index: 1;
}
ul {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  list-style: none;
}
ul li a {
  padding: 10px;
  text-decoration: none;
  color: var(--main-font-color);
}

.active {
  border-bottom: 2px solid var(--main-font-color);
  transition: all 0.2s ease-in;
}
</style>
