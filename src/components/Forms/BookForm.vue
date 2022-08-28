<script setup lang="ts">
import "./style.css";
import { listYears } from "@/utils/listYears";
import { onMounted, reactive, toRefs, watch } from "vue";
import type { RequestAPI } from "@/models/RequestAPI";
import type { Book, BookCreate } from "@/models/Book";
import { BookService } from "@/services/book";
import { useRoute, useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { helpers, required, between } from "@vuelidate/validators";
const props = defineProps<{
  id?: number;
}>();

const { id } = toRefs(props);
const router = useRouter();
const route = useRoute();
const book = reactive<RequestAPI<Book | null>>({
  loading: false,
  error: null,
  data: null,
});

const initialState = {
  name: "",
  description: "",
  publication_year: null,
  author: "",
  gender: "",
};
const form = reactive<BookCreate>({
  ...initialState,
});

const messageRequired = "Este campo es necesario";
const rules = useVuelidate(
  {
    name: {
      required: helpers.withMessage(messageRequired, required),
    },
    description: {
      required: helpers.withMessage(messageRequired, required),
    },
    publication_year: {
      required: helpers.withMessage(messageRequired, required),
      betweenValue: helpers.withMessage(
        "Ingrese un año valido",
        between(0, new Date().getFullYear())
      ),
    },
    author: {
      required: helpers.withMessage(messageRequired, required),
    },
    gender: {
      required: helpers.withMessage(messageRequired, required),
    },
  },
  form
);

watch(
  () => route.params.id,
  () => {
    book.data = null;
    Object.assign(form, initialState);
  }
);

const onSubmit = async () => {
  try {
    if (!(await rules.value.$validate())) return;
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
  Object.assign(form, { ...form, ...current.data });
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
      <div>
        <input
          @blur="rules.name.$touch"
          v-model="form.name"
          class="field__input"
          type="text"
          id="name"
          placeholder=""
        />
        <label class="field__label" for="name">Nombre</label>
      </div>
      <div>
        <span v-for="error in rules.name.$errors" :key="error.$uid">
          {{ error.$message }}
        </span>
      </div>
    </fieldset>
    <fieldset class="field__container">
      <div>
        <textarea
          @blur="rules.description.$touch"
          v-model="form.description"
          class="field__input"
          type="area"
          id="desc"
          placeholder=""
        />
        <label class="field__label" for="desc">Descripción</label>
      </div>
      <div>
        <span v-for="error in rules.description.$errors" :key="error.$uid">
          {{ error.$message }}
        </span>
      </div>
    </fieldset>
    <fieldset class="field__container">
      <div>
        <input
          @blur="rules.publication_year.$touch"
          v-model="form.publication_year"
          class="field__input"
          id="year"
          list="years"
          placeholder=""
        />
        <label class="field__label" for="year">Año de publicación</label>
      </div>
      <div>
        <span v-for="error in rules.publication_year.$errors" :key="error.$uid">
          {{ error.$message }}
        </span>
      </div>
      <datalist id="years">
        <option v-for="year in listYears()" :key="year" :value="year"></option>
      </datalist>
    </fieldset>
    <fieldset class="field__container">
      <div>
        <input
          @blur="rules.author.$touch"
          v-model="form.author"
          class="field__input"
          type="text"
          id="author"
          placeholder=""
        />
        <label class="field__label" for="author">Autor</label>
      </div>
      <div>
        <span v-for="error in rules.author.$errors" :key="error.$uid">
          {{ error.$message }}
        </span>
      </div>
    </fieldset>
    <fieldset class="field__container">
      <div>
        <input
          @blur="rules.gender.$touch"
          v-model="form.gender"
          class="field__input"
          type="text"
          id="gender"
          placeholder=""
        />
        <label class="field__label" for="gender">Género</label>
      </div>
      <div>
        <span v-for="error in rules.gender.$errors" :key="error.$uid">
          {{ error.$message }}
        </span>
      </div>
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

textarea {
  font-family: var(--main-font);
  font-size: 1.8rem;
}

.submit,
button {
  font-size: 1.6rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 5px;
  color: var(--main-font-color);
  cursor: pointer;
}

.submit {
  background: var(--main-color);
}
button {
  background: none;
  border: 1px solid #ddd;
}
</style>
