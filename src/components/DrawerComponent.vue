<script setup lang="ts">
import EssentialLink from "components/EssentialLink.vue";
import { signInUserThroughGoogle, signOutUser } from "src/firebase";
import { useLayoutStore } from "src/stores/layout";
import { useAuthStore } from "src/stores/auth";
import {
  HOME_URL,
  CREATE_TAG_URL,
  CREATE_FLASHCARD_URL,
  EDIT_FLASHCARD_URL,
  MEMORIES_URL,
} from "src/utils/url";

const authStore = useAuthStore();
const layoutStore = useLayoutStore();

const list = [
  {
    title: "Memories",
    icon: "r_description",
    link: MEMORIES_URL,
  },
  {
    title: "Home",
    icon: "r_home",
    link: HOME_URL,
  },
  {
    title: "Create Tag",
    icon: "r_add",
    link: CREATE_TAG_URL,
  },
  {
    title: "Create Flashcard",
    icon: "r_add",
    link: CREATE_FLASHCARD_URL,
  },
  {
    title: "Edit Flashcard",
    icon: "r_edit",
    link: EDIT_FLASHCARD_URL,
  },
];

const clickLogin = () => signInUserThroughGoogle();
const clickLogout = () => signOutUser();
</script>

<template>
  <q-drawer
    :model-value="layoutStore.isDrawerOpen"
    v-on:update:model-value="layoutStore.toggleDrawer"
    show-if-above
    bordered
  >
    <q-list>
      <q-item-label header>Memory</q-item-label>
      <EssentialLink v-for="item in list" :key="item.title" v-bind="item" />
      <q-separator></q-separator>
      <EssentialLink
        title="Login"
        icon="login"
        :on-click="clickLogin"
        v-if="authStore.isSuccess && !authStore.isAuthenticated"
      />
      <q-item-label header>Settings</q-item-label>
      <EssentialLink
        title="Logout"
        icon="logout"
        :on-click="clickLogout"
        v-if="authStore.isSuccess && authStore.isAuthenticated"
      />
    </q-list>
  </q-drawer>
</template>
