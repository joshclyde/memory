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
} from "src/utilities/url";

const authStore = useAuthStore();
const layoutStore = useLayoutStore();

const list = [
  {
    title: "Home",
    caption: "Study your flashcards",
    icon: "r_home",
    link: HOME_URL,
  },
  {
    title: "Create Tag",
    caption: "Create a new tag",
    icon: "r_add",
    link: CREATE_TAG_URL,
  },
  {
    title: "Create Flashcard",
    caption: "Create a new flashcard",
    icon: "r_add",
    link: CREATE_FLASHCARD_URL,
  },
  {
    title: "Edit Flashcard",
    caption: "Edit any flashcards",
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
