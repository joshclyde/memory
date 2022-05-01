import { defineStore } from 'pinia';
import { startFirebaseEventListening } from 'src/firebase';

// import { useTagsStore } from './tags';

interface AuthState {
  isAuthenticated: boolean;
  loading: null | 'PENDING' | 'SUCCESS' | 'ERROR';
  uid: null | string;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  uid: null,
  loading: null,
};

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => initialAuthState,
  getters: {
    getIsAuthenticated: (state) => state.isAuthenticated,
    getLoading: (state) => state.loading,
  },
  actions: {
    pending() {
      this.loading = 'PENDING';
      this.uid = null;
      this.isAuthenticated = false;
    },
    success(uid: string | null) {
      this.loading = 'SUCCESS';
      this.uid = uid;
      if (uid) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    },
    failure() {
      this.loading = 'ERROR';
      this.uid = null;
      this.isAuthenticated = false;
    },
  },
});

const isListening = false;
export const useStartAuthListener = () => {
  const authStore = useAuthStore();
  // const tagsStore = useTagsStore();
  if (!isListening) {
    authStore.pending();
    startFirebaseEventListening(
      ({ uid }) => {
        authStore.success(uid);
        // tagsStore.fetchTags();
      },
      () => {
        authStore.success(null);
        // tagsStore.clearTags();
      },
    );
  }
};
