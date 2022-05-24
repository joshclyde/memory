import { defineStore } from "pinia";
import { startFirebaseEventListening } from "src/firebase";

import { useTagsStore } from "./tags";
import { useFlashcardsStore } from "./flashcards";

interface AuthState {
  isAuthenticated: boolean;
  loading: null | "PENDING" | "SUCCESS" | "ERROR";
  uid: null | string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  uid: null,
  loading: null,
};

export const useAuthStore = defineStore({
  id: "auth",
  state: () => initialState,
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
        await Promise.all([tagsStore.fetch(), flashcardsStore.fetch()]);
        authStore.success(uid);
      },
      () => {
        authStore.success(null);
        tagsStore.clear();
        flashcardsStore.clear();
      }
    );
  }
};
