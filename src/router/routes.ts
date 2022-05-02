import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/tag/create",
        component: () => import("pages/CreateTagPage.vue"),
      },
      {
        path: "/flashcard/create",
        component: () => import("pages/CreateFlashcardPage.vue"),
      },
      {
        path: "/review/:tagId",
        component: () => import("pages/ReviewTagPage.vue"),
      },
      {
        path: "/review",
        component: () => import("pages/ReviewPage.vue"),
      },
      { path: "", component: () => import("pages/IndexPage.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
