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
    // getSetById: (state) => {
    //   return (setId: string) => state.flashcardSets[setId];
    // },
    // getLengthOfSetById: (state) => {
    //   return (setId: string) =>
    //     Object.keys(state.flashcardSets[setId].flashcards).length;
    // },
    // getFrontOfCard: (state) => {
    //   return (setId: string, cardId: string) =>
    //     state.flashcardSets[setId].flashcards[cardId].front;
    // },
    // getBackOfCard: (state) => {
    //   return (setId: string, cardId: string) =>
    //     state.flashcardSets[setId].flashcards[cardId].back;
    // },
    // getFrontOfCardByIndex: (state) => {
    //   return (setId: string, index: number) =>
    //     Object.values(state.flashcardSets[setId].flashcards)[index].front;
    // },
    // getBackOfCardByIndex: (state) => {
    //   return (setId: string, index: number) =>
    //     Object.values(state.flashcardSets[setId].flashcards)[index].back;
    // },
  },
});
