import { defineStore } from "pinia";
import {
  createFlashcard,
  updateFlashcard,
  fetchFlashcards,
  deleteFlashcard,
} from "src/firebase";
import {
  convertComputedFields,
  convertLastModified,
} from "src/utils/firestore";
import { FirestoreFlashcardUserInput } from "src/firebase/firestore/types";
import { StateFlashcard } from "./types";

export interface FlashcardsState {
  flashcardsIncludingDeleted: Record<string, StateFlashcard>;
}

const initialState: FlashcardsState = { flashcardsIncludingDeleted: {} };

export const useFlashcardsStore = defineStore({
  id: "flashcards",
  state: () => initialState,
  actions: {
    clear() {
      this.flashcardsIncludingDeleted = {};
    },
    async fetch() {
      const firestoreFlashcards = await fetchFlashcards();
      Object.entries(firestoreFlashcards).forEach(
        ([id, firestoreFlashcard]) => {
          this.flashcardsIncludingDeleted[id] =
            convertComputedFields(firestoreFlashcard);
        }
      );
    },
    async create(data: FirestoreFlashcardUserInput) {
      const [id, firestoreFlashcard] = await createFlashcard(data);
      this.flashcardsIncludingDeleted[id] =
        convertComputedFields(firestoreFlashcard);
      return id;
    },
    async update(id: string, data: FirestoreFlashcardUserInput) {
      const firestoreFlashcard = await updateFlashcard(id, data);
      this.flashcardsIncludingDeleted[id] = {
        ...this.flashcards[id],
        ...convertLastModified(firestoreFlashcard),
      };
    },
    async delete(id: string) {
      const firestoreFlashcard = await deleteFlashcard(id);
      this.flashcardsIncludingDeleted[id] = {
        ...this.flashcardsIncludingDeleted[id],
        ...convertLastModified(firestoreFlashcard),
      };
    },
  },
  getters: {
    flashcards(state): Record<string, StateFlashcard> {
      return Object.entries(state.flashcardsIncludingDeleted)
        .filter(([key, value]) => !value.isDeleted)
        .reduce((obj, [key, value]) => {
          return Object.assign(obj, {
            [key]: value,
          });
        }, {});
    },
    getIdsByTagId(): (tagId: string) => Array<string> {
      return (tagId: string) => {
        return Object.keys(this.flashcards).filter((id) =>
          this.flashcards[id].tags.includes(tagId)
        );
      };
    },
    filterByTag(): (tagIds: Array<string>) => Array<string> {
      return (tagIds: Array<string>) => {
        return Object.keys(this.flashcards).filter((id) =>
          this.flashcards[id].tags.some((item) => tagIds.includes(item))
        );
      };
    },
    tagSizes(): Record<string, number> {
      const retValue: Record<string, number> = {};
      Object.values(this.flashcards).forEach(({ tags }) => {
        tags.forEach((tagId) => {
          retValue[tagId] = retValue[tagId] ? retValue[tagId] + 1 : 1;
        });
      });
      return retValue;
    },
  },
});
