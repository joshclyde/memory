import { defineStore } from "pinia";
import { startFirebaseEventListening } from "src/firebase";

import { useTagsStore } from "./tags";
import { useFlashcardsStore } from "./flashcards";

interface AuthState {
  isAuthenticated: boolean;
  loading: null | "PENDING" | "SUCCESS" | "ERROR";
  uid: null | string;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  uid: null,
  loading: null,
};

export const useAuthStore = defineStore({
  id: "auth",
  state: () => initialAuthState,
  getters: {
    getIsAuthenticated: (state) => state.isAuthenticated,
    getLoading: (state) => state.loading,
    isSuccess: (state) => state.loading === "SUCCESS",
  },
  actions: {
    pending() {
      this.loading = "PENDING";
      this.uid = null;
      this.isAuthenticated = false;
    },
    success(uid: string | null) {
      this.loading = "SUCCESS";
      this.uid = uid;
      if (uid) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    },
    failure() {
      this.loading = "ERROR";
      this.uid = null;
      this.isAuthenticated = false;
    },
  },
});

const isListening = false;
export const useStartAuthListener = () => {
  const authStore = useAuthStore();
  const tagsStore = useTagsStore();
  const flashcardsStore = useFlashcardsStore();
  if (!isListening) {
    authStore.pending();
    startFirebaseEventListening(
      async ({ uid }) => {
        /*
          Eventually, I could do this better so that fetching the data is not
          attached to authentication. But for now, this is just simpler.
        */
        await tagsStore.fetchTags();
        await flashcardsStore.fetch();
        authStore.success(uid);
      },
      () => {
        authStore.success(null);
        tagsStore.clearTags();
        flashcardsStore.clear();
      }
    );
  }
};
