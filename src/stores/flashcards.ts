import { defineStore } from "pinia";
import {
  createFlashcard,
  updateFlashcard,
  fetchFlashcards,
} from "src/firebase";
import {
  convertComputedFields,
  convertLastModified,
} from "src/utils/firestore";
import { FirestoreFlashcardUserInput } from "src/firebase/firestore/types";
import { StateFlashcard } from "./types";

interface FlashcardsState {
  flashcards: Record<string, StateFlashcard>;
}

const initialState: FlashcardsState = { flashcards: {} };

export const useFlashcardsStore = defineStore({
  id: "flashcards",
  state: () => initialState,
  actions: {
    clear() {
      this.flashcards = {};
    },
    async fetch() {
      const firestoreFlashcards = await fetchFlashcards();
      Object.entries(firestoreFlashcards).forEach(
        ([id, firestoreFlashcard]) => {
          this.flashcards[id] = convertComputedFields(firestoreFlashcard);
        }
      );
    },
    async create(data: FirestoreFlashcardUserInput) {
      const [id, firestoreFlashcard] = await createFlashcard(data);
      this.flashcards[id] = convertComputedFields(firestoreFlashcard);
      return id;
    },
    async update(id: string, data: FirestoreFlashcardUserInput) {
      const firestoreFlashcard = await updateFlashcard(id, data);
      this.flashcards[id] = {
        ...this.flashcards[id],
        ...convertLastModified(firestoreFlashcard),
      };
    },
  },
  getters: {
    getIdsByTagId: (state) => {
      return (tagId: string) => {
        return Object.keys(state.flashcards).filter((id) =>
          state.flashcards[id].tags.includes(tagId)
        );
      };
    },
    filterByTag: (state) => {
      return (tagIds: Array<string>) => {
        return Object.keys(state.flashcards).filter((id) =>
          state.flashcards[id].tags.some((item) => tagIds.includes(item))
        );
      };
    },
  },
});
