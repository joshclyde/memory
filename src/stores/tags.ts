import { defineStore } from "pinia";
import { createTag, updateTag, fetchTags, deleteTag } from "src/firebase";
import {
  convertComputedFields,
  convertLastModified,
} from "src/utils/firestore";
import { FirestoreTagUserInput } from "src/firebase/firestore/types";
import { StateTag } from "./types";

type TagsState = {
  tags: Record<string, StateTag>;
};

const initialState: TagsState = { tags: {} };

export const useTagsStore = defineStore({
  id: "tags",
  state: () => initialState,
  actions: {
    clear() {
      this.tags = {};
    },
    async fetch() {
      const firestoreTags = await fetchTags();
      Object.entries(firestoreTags).forEach(([id, firestoreTag]) => {
        this.tags[id] = convertComputedFields(firestoreTag);
      });
    },
    async create(data: FirestoreTagUserInput) {
      const [id, firestoreTag] = await createTag(data);
      this.tags[id] = convertComputedFields(firestoreTag);
      return id;
    },
    async update(id: string, data: FirestoreTagUserInput) {
      const firestoreTag = await updateTag(id, data);
      this.tags[id] = {
        ...this.tags[id],
        ...convertLastModified(firestoreTag),
      };
    },
    async delete(id: string) {
      const firestoreTag = await deleteTag(id);
      this.tags[id] = {
        ...this.tags[id],
        ...convertLastModified(firestoreTag),
      };
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
