import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/tag/edit/:tagId",
        component: () => import("pages/EditTagByIdPage.vue"),
      },
      {
        path: "/tag/create",
        component: () => import("pages/CreateTagPage.vue"),
      },
      {
        path: "/flashcard/create",
        component: () => import("pages/CreateFlashcardPage.vue"),
      },
      {
        path: "/flashcard/edit/:flashcardId",
        component: () => import("pages/EditFlashcardByIdPage.vue"),
      },
      {
        path: "/flashcard/edit",
        component: () => import("pages/EditFlashcardPage.vue"),
      },
      {
        path: "/review/:tagId",
        component: () => import("pages/ReviewTagPage.vue"),
      },
      { path: "", component: () => import("pages/HomePage.vue") },
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
