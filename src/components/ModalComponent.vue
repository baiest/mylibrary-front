<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps<{
  isOpen: boolean;
}>();

const { isOpen } = toRefs(props);

const emits = defineEmits(["closeModal"]);
const closeModal = () => {
  emits("closeModal");
};
</script>

<template>
  <teleport to="body">
    <transition name="show">
      <div class="modal" v-show="isOpen">
        <div class="modal__background" @click="closeModal"></div>
        <div class="modal__container">
          <button class="modal__close" @click="closeModal">
            <span>x</span>
          </button>
          <section class="modal__title">
            <slot name="title"></slot>
          </section>
          <section class="modal__body">
            <slot name="body"></slot>
          </section>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal {
  display: grid;
  justify-content: center;
  align-items: center;
  position: fixed;
  padding: 20px;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
}
.modal__background {
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: absolute;
}
.modal__container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 250px;
  max-width: 850px;
  background: #fff;
  color: #000;
  max-height: 70vh;
}

.modal__title {
  background: var(--main-color);
  padding: 10px;
}
.modal__body {
  padding: 20px;
  overflow: auto;
}
.modal__close {
  position: absolute;
  top: -10px;
  right: 0;
}

.show-enter-active,
.show-leave-active {
  transition: opacity 0.2s ease;
}

.show-enter-from,
.show-leave-to {
  opacity: 0;
}
</style>
