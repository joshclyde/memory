<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Memory </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Pages </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <p v-if="pending">Checking login status...</p>
      <p v-if="error">
        Something bad happened when trying to check login status.
      </p>
      <router-view v-if="success && isAuthenticated" />
      <div v-if="success && !isAuthenticated">
        <p>You are not logged in.</p>
        <login-button></login-button>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useAuthStore, useStartAuthListener } from "stores/auth";
import { signInUserThroughGoogle, signOutUser } from "src/firebase";

const linksList = [
  {
    title: "Home",
    caption: "Go home",
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

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    useStartAuthListener();
    const authStore = useAuthStore();
    const pending = computed(() => authStore.loading === "PENDING");
    const success = computed(() => authStore.loading === "SUCCESS");
    const error = computed(() => authStore.loading === "ERROR");
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      pending,
      success,
      error,
      isAuthenticated,
    };
  },
});
</script>
