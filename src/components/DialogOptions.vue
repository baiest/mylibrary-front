<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps<{
  x: number;
  y: number;
  idBook?: number | null;
}>();
const { x, y } = toRefs(props);
</script>
<template>
  <dialog
    :style="{
      top: y + 'px',
      left: x + 'px',
    }"
  >
    <slot></slot>
  </dialog>
</template>

<style>
dialog {
  position: absolute;
  border: 1px solid #ccc;
  padding: 0;
  margin: 0;
  transition: top 0.2s ease, left 0.2s ease;
}
.dialog__options {
  padding: 0;
  margin: 0;
  list-style: none;
}
.dialog__item {
  padding: 5px 15px;
  cursor: pointer;
}

.dialog__item:hover {
  background: rgba(0, 0, 0, 0.1);
}
</style>
