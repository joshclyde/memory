import { defineStore } from "pinia";

interface LayoutState {
  isDrawerOpen: boolean;
}

const initialLayoutState: LayoutState = {
  isDrawerOpen: false,
};

export const useLayoutStore = defineStore({
  id: "layout",
  state: () => initialLayoutState,
  actions: {
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen;
    },
  },
});
