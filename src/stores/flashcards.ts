import { defineStore } from "pinia";
import {
  getFlashcards as getFlashcardsFirestore,
  createFlashcard as createFlashcardFirestore,
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
  },
  getters: {
    getIdsByTagId: (state) => {
      return (tagId: string) => {
        return Object.keys(state.flashcards).filter((id) =>
          state.flashcards[id].tags.includes(tagId)
        );
      };
    },
  },
});
