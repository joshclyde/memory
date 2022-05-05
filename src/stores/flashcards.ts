import { defineStore } from "pinia";
import {
  getFlashcards as getFlashcardsFirestore,
  createFlashcard as createFlashcardFirestore,
  updateFlashcard as updateFlashcardFirestore,
} from "src/firebase";

interface FlashcardsState {
  flashcards: Record<
    string,
    { front: string; back: string; tags: Array<string> }
  >;
}

const initialState: FlashcardsState = { flashcards: {} };

export const useFlashcardsStore = defineStore({
  id: "flashcards",
  state: () => initialState,
  actions: {
    async fetch() {
      const flashcards = await getFlashcardsFirestore();
      this.flashcards = flashcards;
    },
    clear() {
      this.flashcards = {};
    },
    async create({
      front,
      back,
      tags,
    }: {
      front: string;
      back: string;
      tags: Array<string>;
    }) {
      const id = await createFlashcardFirestore({ front, back, tags });
      this.flashcards[id] = { front, back, tags };
      return id;
    },
    async update({
      id,
      front,
      back,
      tags,
    }: {
      id: string;
      front: string;
      back: string;
      tags: Array<string>;
    }) {
      await updateFlashcardFirestore({ id, front, back, tags });
      this.flashcards[id] = { front, back, tags };
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
