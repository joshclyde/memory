<script setup lang="ts">
import { signInUserThroughGoogle, signOutUser } from "src/firebase";
import { useLayoutStore } from "src/stores/layout";
import { useAuthStore } from "src/stores/auth";
import { HOME_URL, MEMORIES_URL, TAGS_URL } from "src/utils/url";
import DrawerLink from "./DrawerLink.vue";

const authStore = useAuthStore();
const layoutStore = useLayoutStore();

const list = [
  {
    title: "Learn",
    icon: "r_school",
    link: HOME_URL,
  },
  {
    title: "Memories",
    icon: "r_description",
    link: MEMORIES_URL,
  },
  {
    title: "Tags",
    icon: "r_sell",
    link: TAGS_URL,
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
      <DrawerLink v-for="item in list" :key="item.title" v-bind="item" />
      <q-separator></q-separator>
      <DrawerLink
        title="Login"
        icon="login"
        :on-click="clickLogin"
        v-if="authStore.isSuccess && !authStore.isAuthenticated"
      />
      <q-item-label header>Settings</q-item-label>
      <DrawerLink
        title="Logout"
        icon="logout"
        :on-click="clickLogout"
        v-if="authStore.isSuccess && authStore.isAuthenticated"
      />
    </q-list>
  </q-drawer>
</template>
