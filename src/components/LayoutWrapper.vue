<script lang="ts" setup>
import NavMenu from "./NavMenu.vue";
</script>

<template>
  <NavMenu />
  <main class="container">
    <slot></slot>
  </main>
</template>

<style scoped></style>
