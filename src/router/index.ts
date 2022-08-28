import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/book/:id",
      name: "detail",
      props: (router) => ({
        id: router.params.id,
      }),
      component: () => import("../views/BookView.vue"),
    },
    {
      path: "/book/new",
      name: "new",
      props: () => ({
        id: null,
      }),
      component: () => import("../components/Forms/BookForm.vue"),
    },
    {
      path: "/book/update/:id",
      name: "update",
      props: (router) => ({
        id: parseInt(router.params.id as string),
      }),
      component: () => import("../components/Forms/BookForm.vue"),
    },
  ],
});

export default router;
