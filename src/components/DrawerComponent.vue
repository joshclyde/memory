<script setup lang="ts">
import EssentialLink from "components/EssentialLink.vue";
import { signInUserThroughGoogle, signOutUser } from "src/firebase";
import { useLayoutStore } from "src/stores/layout";

const layoutStore = useLayoutStore();

const linksList = [
  {
    title: "Home",
    caption: "Study your flashcards",
    icon: "home",
    link: "/",
  },
  {
    title: "Create Tag",
    caption: "Create a new tag",
    icon: "add",
    link: "/tag/create",
  },
  {
    title: "Create Flashcard",
    caption: "Create a new flashcard",
    icon: "add",
    link: "/flashcard/create",
  },
  {
    title: "Login",
    icon: "login",
    onClick: () => signInUserThroughGoogle(),
  },
  {
    title: "Logout",
    icon: "logout",
    onClick: () => signOutUser(),
  },
];
</script>

<template>
  <q-drawer
    :model-value="layoutStore.isDrawerOpen"
    v-on:update:model-value="layoutStore.toggleDrawer"
    show-if-above
    bordered
  >
    <q-list>
      <q-item-label header> Pages </q-item-label>

      <EssentialLink
        v-for="link in linksList"
        :key="link.title"
        v-bind="link"
      />
    </q-list>
  </q-drawer>
</template>
