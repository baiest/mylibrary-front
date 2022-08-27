<script setup lang="ts">
import type { Book } from "@/models/Book";
import type { RequestAxios } from "@/models/RequestAxios";
import { BookService } from "@/services/book";
import { onMounted, reactive } from "vue";
const books = reactive<RequestAxios<Book[]>>({
  loading: false,
  error: null,
  data: [],
});
onMounted(async () => {
  books.loading = true;
  try {
    books.data = await BookService.getAll();
    books.data = [
      ...books.data,
      ...books.data,
      ...books.data,
      ...books.data,
      ...books.data,
      ...books.data,
      ...books.data,
      ...books.data,
      ...books.data,
    ];
  } catch (error: Error) {
    books.error = error.message;
  }
  books.loading = false;
});
</script>
<template>
  <section class="table__container">
    <p v-if="books.error">{{ books.error }}</p>
    <div class="table">
      <div class="table__header">
        <span>Nombre</span>
        <span>Descripción</span>
        <span>Año de publicacion</span>
        <span>Nombre</span>
        <span>Descripción</span>
        <span>Año de publicacion</span>
      </div>
      <div class="table__body">
        <p v-if="books.loading">Cargando...</p>
        <div class="table__row" v-for="book in books.data" :key="book.id">
          <span>{{ book.name }}</span>
          <span>{{ book.description }}</span>
          <span>{{ book.publication_year }}</span>
          <span>{{ book.name }}</span>
          <span>{{ book.description }}</span>
          <span>{{ book.publication_year }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.table__container {
  max-height: 100%;
  min-width: 250px;
  overflow: auto;
  /* background: lightcoral; */
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
  transition: background 0.1s ease;
}
</style>
