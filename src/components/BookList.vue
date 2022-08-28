<script setup lang="ts">
import type { Book } from "@/models/Book";
import type { RequestAxios } from "@/models/RequestAxios";
import { BookService } from "@/services/book";
import { onMounted, reactive, ref } from "vue";
import DialogOptions from "./DialogOptions.vue";

const books = reactive<RequestAxios<Book[]>>({
  loading: false,
  error: null,
  data: [],
});
onMounted(async () => {
  books.loading = true;
  try {
    books.data = await BookService.getAll();
  } catch (error: Error) {
    books.error = error.message;
  }
  books.loading = false;
});

const dialogCords = reactive<{
  x: number;
  y: number;
}>({
  x: 0,
  y: 0,
});
const tableContainer = ref<HTMLElement | null>(null);
const openDialog = ref(false);
const bookSelected = ref<number | null>(null);
const closeDialog = () => {
  openDialog.value = false;
  bookSelected.value = null;
};
const selectBook = (event: MouseEvent, id: number) => {
  const maxX = (tableContainer.value?.offsetWidth as number) - 100;
  const maxY = (tableContainer.value?.offsetHeight as number) - 60;
  openDialog.value = true;
  bookSelected.value = id;
  dialogCords.x = maxX > event.clientX ? event.clientX : maxX;
  dialogCords.y = maxY > event.clientY ? event.clientY : maxY;
  console.log({ ...dialogCords }, maxX);
};
</script>
<template>
  <section class="table__container" ref="tableContainer">
    <p v-if="books.error">{{ books.error }}</p>
    <div class="table">
      <div class="table__header">
        <span>Nombre</span>
        <span>Descripción</span>
        <span>Año de publicacion</span>
      </div>
      <div class="table__body">
        <p v-if="books.loading">Cargando...</p>
        <div
          class="table__row"
          v-for="book in books.data"
          :key="book.id"
          @click="closeDialog"
          @contextmenu.prevent="selectBook($event, book.id)"
          :class="{
            'table__row-selected': book.id === bookSelected,
          }"
        >
          <span>{{ book.name }}</span>
          <span>{{ book.description }}</span>
          <span>{{ book.publication_year }}</span>
        </div>
      </div>
    </div>
    <DialogOptions
      :open="openDialog"
      :x="dialogCords.x"
      :y="dialogCords.y"
      :id-book="bookSelected"
      v-if="bookSelected"
    >
      <ul class="dialog__options">
        <li class="dialog__item">
          <router-link :to="{ name: 'detail', params: { id: bookSelected } }"
            >Ver</router-link
          >
        </li>
        <li class="dialog__item">Editar</li>
        <li class="dialog__item">Borrar</li>
      </ul>
    </DialogOptions>
  </section>
</template>

<style scoped>
.table__container {
  max-height: 100%;
  min-width: 250px;
  overflow: auto;
  /* background: lightcoral; */
}
.table,
.table__body,
.table__header {
  width: fit-content;
}

.table {
  margin: 0 auto;
}
.table__header,
.table__row {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 150px;
  cursor: pointer;
  width: fit-content;
  transition: background 0.3s ease;
}
.table__header span,
.table__row span {
  padding: 10px;
  border-right: 1px solid rgba(255, 255, 255, 0.3);
}

.table__header {
  background: #ccc;
  color: #000;
}
.table__row:nth-child(2n + 1) {
  background: rgba(0, 0, 0, 1);
}
.table__row:hover {
  background: rgba(255, 255, 255, 0.3);
}
.table__row.table__row-selected {
  background: rgba(255, 255, 255, 0.3);
  transition: background 0.1s ease;
}
</style>
