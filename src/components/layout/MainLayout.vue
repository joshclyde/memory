<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="r_menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Memory </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <drawer-component></drawer-component>

    <q-page-container>
      <div class="container-layout">
        <p v-if="pending">Checking login status...</p>
        <p v-if="error">
          Something bad happened when trying to check login status.
        </p>
        <router-view v-if="success && isAuthenticated" />
        <div v-if="success && !isAuthenticated">
          <p>You are not logged in.</p>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.container-layout {
  /* TODO: do I want a max width here? */
  max-width: 1024px;
  margin: auto;
  padding: 16px 8px;
}
</style>

<script lang="ts">
import { defineComponent, computed } from "vue";
import DrawerComponent from "src/components/layout/DrawerComponent.vue";
import { useAuthStore, useStartAuthListener } from "stores/auth";
import { useLayoutStore } from "src/stores/layout";

export default defineComponent({
  name: "MainLayout",

  components: {
    DrawerComponent,
  },

  setup() {
    useStartAuthListener();
    const authStore = useAuthStore();
    const pending = computed(() => authStore.loading === "PENDING");
    const success = computed(() => authStore.loading === "SUCCESS");
    const error = computed(() => authStore.loading === "ERROR");
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    const layoutStore = useLayoutStore();

    return {
      toggleLeftDrawer() {
        layoutStore.toggleDrawer();
      },
      pending,
      success,
      error,
      isAuthenticated,
    };
  },
});
</script>
