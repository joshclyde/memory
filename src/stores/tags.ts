import { defineStore } from "pinia";
import { createTag, updateTag, fetchTags, deleteTag } from "src/firebase";
import {
  convertComputedFields,
  convertLastModified,
} from "src/utils/firestore";
import { FirestoreTagUserInput } from "src/firebase/firestore/types";
import { StateTag } from "./types";

type TagsState = {
  tagsIncludingDeleted: Record<string, StateTag>;
};

const initialState: TagsState = { tagsIncludingDeleted: {} };

export const useTagsStore = defineStore({
  id: "tags",
  state: () => initialState,
  actions: {
    clear() {
      this.tagsIncludingDeleted = {};
    },
    async fetch() {
      const firestoreTags = await fetchTags();
      Object.entries(firestoreTags).forEach(([id, firestoreTag]) => {
        this.tagsIncludingDeleted[id] = convertComputedFields(firestoreTag);
      });
    },
    async create(data: FirestoreTagUserInput) {
      const [id, firestoreTag] = await createTag(data);
      this.tagsIncludingDeleted[id] = convertComputedFields(firestoreTag);
      return id;
    },
    async update(id: string, data: FirestoreTagUserInput) {
      const firestoreTag = await updateTag(id, data);
      this.tagsIncludingDeleted[id] = {
        ...this.tagsIncludingDeleted[id],
        ...convertLastModified(firestoreTag),
      };
    },
    async delete(id: string) {
      const firestoreTag = await deleteTag(id);
      this.tagsIncludingDeleted[id] = {
        ...this.tagsIncludingDeleted[id],
        ...convertLastModified(firestoreTag),
      };
    },
  },
  getters: {
    tags(state): Record<string, StateTag> {
      return Object.entries(state.tagsIncludingDeleted)
        .filter(([key, value]) => !value.isDeleted)
        .reduce((obj, [key, value]) => {
          return Object.assign(obj, {
            [key]: value,
          });
        }, {});
    },
    formOptions(): Array<{ label: string; value: string }> {
      return Object.entries(this.tags).map(([id, { name }]) => {
        return {
          label: name,
          value: id,
        };
      });
    },
    mapWithKeyValue(): <T>(initState: T) => Record<string, T> {
      return <T>(initState: T) => {
        const retValue: Record<string, T> = {};
        Object.keys(this.tags).forEach((value) => {
          retValue[value] = initState;
        });
        return retValue;
      };
    },
    tagIds(): Array<string> {
      return Object.keys(this.tags);
    },
    getTagById(state) {
      return (id: string) => {
        return state.tagsIncludingDeleted[id];
      };
    },
  },
});
