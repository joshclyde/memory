import { defineStore } from "pinia";
import {
  getTags as getTagsFirestore,
  createTag as createTagFirestore,
} from "src/firebase";

type TagsState = {
  tags: Record<string, { name: string }>;
};

const initialState: TagsState = { tags: {} };

export const useTagsStore = defineStore({
  id: "tags",
  state: () => initialState,
  actions: {
    async fetchTags() {
      const tags = await getTagsFirestore();
      this.tags = tags;
    },
    clearTags() {
      this.tags = {};
    },
    async createTag({ name }: { name: string }) {
      const id = await createTagFirestore({ name });
      this.tags[id] = { name };
      return id;
    },
    updateTag(id: string, { name }: { name: string }) {
      this.tags[id] = { name };
    },
    deleteTag({ id }: { id: string }) {
      delete this.tags[id];
    },
  },
  getters: {
    formOptions: (state) => {
      return Object.entries(state.tags).map(([id, { name }]) => {
        return {
          label: name,
          value: id,
        };
      });
    },
    mapWithKeyValue: (state) => {
      return <T>(initState: T) => {
        const retValue: Record<string, T> = {};
        Object.keys(state.tags).forEach((value) => {
          retValue[value] = initState;
        });
        return retValue;
      };
    },
    tagIds: (state) => {
      return Object.keys(state.tags);
    },
    getTagById: (state) => {
      return (id: string) => {
        return state.tags[id];
      };
    },
  },
});
