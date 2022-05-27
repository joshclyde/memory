import { RouteRecordRaw } from "vue-router";
import * as UrlUtils from "src/utils/url";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: UrlUtils.MEMORIES_URL,
        component: () => import("pages/ViewMemoriesPage.vue"),
      },
      {
        path: UrlUtils.CREATE_TAG_URL,
        component: () => import("pages/CreateTagPage.vue"),
      },
      {
        path: UrlUtils.editTagByIdUrl(":tagId"),
        component: () => import("pages/EditTagByIdPage.vue"),
      },
      {
        path: UrlUtils.CREATE_FLASHCARD_URL,
        component: () => import("pages/CreateFlashcardPage.vue"),
      },
      {
        path: UrlUtils.editFlashcardByIdUrl(":flashcardId"),
        component: () => import("pages/EditFlashcardByIdPage.vue"),
      },
      {
        path: UrlUtils.EDIT_FLASHCARD_URL,
        component: () => import("pages/EditFlashcardPage.vue"),
      },
      {
        path: UrlUtils.reviewTagUrl(":tagId"),
        component: () => import("pages/ReviewTagPage.vue"),
      },
      {
        path: UrlUtils.learnTagUrl(":tagId"),
        component: () => import("pages/LearnTagPage.vue"),
      },
      {
        path: UrlUtils.HOME_URL,
        component: () => import("pages/HomePage.vue"),
      },
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
