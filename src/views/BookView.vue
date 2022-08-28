<script setup lang="ts">
import type { Book } from "@/models/Book";
import type { RequestAPI } from "@/models/RequestAPI";
import { BookService } from "@/services/book";
import { onMounted, reactive, toRefs, watch } from "vue";
const props = defineProps<{
  id: string;
}>();

const { id } = toRefs(props);
const book = reactive<RequestAPI<Book | null>>({
  loading: false,
  error: null,
  data: null,
});

onMounted(async () => {
  book.loading = true;
  try {
    book.data = await BookService.getById(id.value);
  } catch (err) {
    const error = err as Error;
    book.error = error.message;
  }
  book.loading = false;
});
</script>

<template>
  <p v-if="book.error">{{ book.error }}</p>
  <p v-if="book.loading">Cargando...</p>
  <h2 class="detail__title">{{ book.data?.name }}</h2>
  <section class="detail__info">
    <span>Author: {{ book.data?.author }}</span>
    <span>Año de publicación: {{ book.data?.publication_year }}</span>
  </section>
  <p>{{ book.data?.description }}</p>
</template>

<style scoped>
.detail__title {
  font-size: 2.5rem;
}

.detail__info {
  display: flex;
  flex-direction: column;
  font-size: 1.2rem;
  font-weight: 500;
}
</style>
