<script setup lang="ts">
import type { Book } from "@/models/Book";
import type { RequestAPI } from "@/models/RequestAPI";
import { BookService } from "@/services/book";
import { onMounted, reactive, ref } from "vue";
import DialogOptions from "./DialogOptions.vue";
import Modal from "./ModalComponent.vue";

const books = reactive<RequestAPI<Book[]>>({
  loading: false,
  error: null,
  data: [],
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
const bookSelected = ref<Book | null>(null);

const closeDialog = () => {
  openDialog.value = false;
  bookSelected.value = null;
};

const selectBook = (event: MouseEvent, book: Book) => {
  const maxX = (tableContainer.value?.offsetWidth as number) - 100;
  const maxY = (tableContainer.value?.offsetHeight as number) - 60;
  openDialog.value = true;
  bookSelected.value = book;
  dialogCords.x = maxX > event.clientX ? event.clientX : maxX;
  dialogCords.y = maxY > event.clientY ? event.clientY : maxY;
};

const isOpenDelete = ref(false);

const openDelete = () => {
  isOpenDelete.value = true;
  openDialog.value = false;
};
const closeDelete = () => {
  isOpenDelete.value = false;
  bookSelected.value = null;
};

const deleteBook = async () => {
  try {
    if (!bookSelected.value) return;
    await BookService.delete(bookSelected.value.id);
    const indexBook = books.data.findIndex(
      (b) => b.id === bookSelected.value?.id
    );
    books.data.splice(indexBook, 1);
    closeDelete();
  } catch (error: Error) {
    books.error = error.response.message;
  }
};

onMounted(async () => {
  books.loading = true;
  try {
    books.data = await BookService.getAll();
  } catch (error: Error) {
    books.error = error.message;
  }
  books.loading = false;
});
</script>
<template>
  <section class="table__container" ref="tableContainer">
    <p v-if="books.error">{{ books.error }}</p>
    <div class="table">
      <div class="table__header">
        <span>Nombre</span>
        <span>Descripción</span>
        <span>Género</span>
        <span>Año de publicacion</span>
        <span>Creado</span>
        <span>Actualizado</span>
      </div>
      <div class="table__body">
        <p v-if="books.loading">Cargando...</p>
        <div
          class="table__row"
          v-for="book in books.data"
          :key="book.id"
          @click="closeDialog"
          @contextmenu.prevent="selectBook($event, book)"
          :class="{
            'table__row-selected': book.id === bookSelected?.id,
          }"
        >
          <span>{{ book.name }}</span>
          <span>{{ book.description }}</span>
          <span>{{ book.gender }}</span>
          <span>{{ book.publication_year }}</span>
          <span>{{ book.created_at.toLocaleString() }}</span>
          <span>{{ book.updated_at.toLocaleString() }}</span>
        </div>
      </div>
    </div>
    <DialogOptions
      :open="openDialog"
      :x="dialogCords.x"
      :y="dialogCords.y"
      :id-book="bookSelected.id"
      v-if="bookSelected"
    >
      <ul class="dialog__options">
        <li class="dialog__item">
          <router-link
            :to="{ name: 'detail', params: { id: bookSelected.id } }"
          >
            Ver
          </router-link>
        </li>
        <li class="dialog__item">
          <router-link
            :to="{ name: 'update', params: { id: bookSelected.id } }"
          >
            Editar
          </router-link>
        </li>
        <li class="dialog__item">
          <button @click="openDelete">Borrar</button>
        </li>
      </ul>
    </DialogOptions>
  </section>
  <Modal :is-open="isOpenDelete" @close-modal="closeDelete">
    <template v-slot:title><h2>Borrar libro</h2></template>
    <template v-slot:body>
      <p>¿Seguro quieres borrar este libro?</p>
      <p>{{ bookSelected?.name }} de {{ bookSelected?.author }}</p>
      <section class="modal__options">
        <button @click="deleteBook" type="button" class="modal__options-btn">
          Si, borrar
        </button>
        <button
          @click="closeDelete"
          type="button"
          class="modal__options-btn cancel"
        >
          No, Cancelar
        </button>
      </section>
    </template>
  </Modal>
</template>

<style scoped>
.table__container {
  max-height: 100%;
  min-width: 250px;
  overflow: auto;
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
.table__row span:last-child {
  border-right: none;
}
.table__row.table__row-selected {
  background: rgba(255, 255, 255, 0.3);
  transition: background 0.1s ease;
}

.dialog__options {
  padding: 0;
  margin: 0;
  list-style: none;
}

.dialog__item a,
.dialog__item button {
  display: flex;
  padding: 5px 20px;
}

.dialog__item button {
  border: none;
  background: none;
  font-size: 1.6rem;
  cursor: pointer;
}

a {
  text-decoration: none;
  color: #000;
}
.dialog__item:hover {
  background: #cccccca1;
  cursor: pointer;
}
h2 {
  margin: 1rem 0;
}

p {
  text-align: center;
  font-size: 1.8rem;
  margin: 1rem 0;
}

.modal__options {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 20px 0;
}
.modal__options-btn {
  padding: 10px 15px;
  font-size: 1.6rem;
  cursor: pointer;

  background: var(--main-color);
  border: none;
  border-radius: 12px;
  transition: all 0.1s ease-out;
}
.modal__options-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px #00000090;
  transition: all 0.1s ease-in;
}
.modal__options-btn.cancel {
  border: 1px solid var(--main-color);
  background: none;
}
</style>
