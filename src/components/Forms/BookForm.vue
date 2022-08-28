<script setup lang="ts">
import "./style.css";
import { listYears } from "@/utils/listYears";
import { onMounted, reactive, toRefs, watch } from "vue";
import type { RequestAxios } from "@/models/RequestAxios";
import type { Book, BookCreate } from "@/models/Book";
import { BookService } from "@/services/book";
import { useRouter } from "vue-router";
const props = defineProps<{
  id?: number;
}>();

const { id } = toRefs(props);
const router = useRouter();
const book = reactive<RequestAxios<Book | null>>({
  loading: false,
  error: null,
  data: null,
});

const form = reactive<BookCreate>({
  name: "",
  description: "",
  publication_year: null,
  author: "",
  gender: "",
});

const onSubmit = async () => {
  try {
    if (!id?.value) {
      await BookService.create({ ...form });
    } else {
      await BookService.update(id.value, { ...form });
    }
    router.push({ name: "home" });
  } catch (error: any) {
    book.error = error.response.message;
  }
};

const onCancel = () => {
  router.push({ name: "home" });
};

watch(book, (current) => {
  if (!current.data) return;
  type options = "name"; //One property to evit error ts key implicity any
  const data = current.data;
  const keys = Object.keys(data) as options[];
  for (const key of keys) {
    form[key] = data[key];
  }
});

onMounted(async () => {
  if (!id?.value) return;
  try {
    book.data = await BookService.getById(id.value as number);
  } catch (error: any) {
    book.error = error.response.message;
  }
});
</script>

<template>
  <form @submit.prevent="onSubmit">
    <p v-if="book.error">{{ book.error }}</p>
    <fieldset class="field__container">
      <input
        v-model="form.name"
        class="field__input"
        type="text"
        id="name"
        placeholder=""
      />
      <label class="field__label" for="name">Nombre</label>
    </fieldset>
    <fieldset class="field__container">
      <textarea
        v-model="form.description"
        class="field__input"
        type="area"
        id="desc"
        placeholder=""
      />
      <label class="field__label" for="desc">Descripción</label>
    </fieldset>
    <fieldset class="field__container">
      <input
        v-model="form.publication_year"
        class="field__input"
        id="year"
        list="years"
        placeholder=""
      />
      <label class="field__label" for="year">Año de publicación</label>
      <datalist id="years">
        <option v-for="year in listYears()" :key="year" :value="year"></option>
      </datalist>
    </fieldset>
    <fieldset class="field__container">
      <input
        v-model="form.author"
        class="field__input"
        type="text"
        id="author"
        placeholder=""
      />
      <label class="field__label" for="author">Autor</label>
    </fieldset>
    <fieldset class="field__container">
      <input
        v-model="form.gender"
        class="field__input"
        type="text"
        id="gender"
        placeholder=""
      />
      <label class="field__label" for="gender">Género</label>
    </fieldset>
    <fieldset class="field__container field__options">
      <input class="submit" type="submit" value="Guardar" />
      <button type="button" @click="onCancel">Cancelar</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  max-width: 450px;
  margin: 0 auto;
}
.field__options {
  display: flex;
  gap: 10px;
  float: right;
}

.submit,
button {
  font-size: 1.6rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
}

.submit {
  background: #8e8effaa;
}
button {
  background: none;
  border: 1px solid #ddd;
}
</style>
