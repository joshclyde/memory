import { RouteRecordRaw } from "vue-router";
import * as UrlUtils from "src/utils/url";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("src/components/layout/MainLayout.vue"),
    children: [
      {
        path: UrlUtils.MEMORIES_URL,
        component: () => import("src/components/pages/MemoriesPage.vue"),
      },
      {
        path: UrlUtils.TAGS_URL,
        component: () => import("src/components/pages/TagsPage.vue"),
      },
      {
        path: UrlUtils.learnTagUrl(":tagId"),
        component: () => import("src/components/pages/LearnTagPage.vue"),
      },
      {
        path: UrlUtils.HOME_URL,
        component: () => import("src/components/pages/HomePage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/components/pages/ErrorNotFound.vue"),
  },
];

export default routes;
