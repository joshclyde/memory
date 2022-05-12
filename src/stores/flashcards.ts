import { defineStore } from "pinia";
import {
  getFlashcards as getFlashcardsFirestore,
  createFlashcard as createFlashcardFirestore,
  updateFlashcard as updateFlashcardFirestore,
} from "src/firebase";
import { convertTimestampToString } from "src/utilities/firestore";
import { Timestamp } from "firebase/firestore";

interface FlashcardsState {
  flashcards: Record<
    string,
    {
      front: string;
      back: string;
      tags: Array<string>;
      createdDate?: string;
      lastUpdatedDate?: string;
    }
  >;
}

const convertFirestoreFlashcard = ({
  front,
  back,
  tags,
  createdDate,
  lastUpdatedDate,
}: {
  front: string;
  back: string;
  tags: Array<string>;
  createdDate?: Timestamp;
  lastUpdatedDate?: Timestamp;
}) => {
  return {
    front,
    back,
    tags,
    createdDate: createdDate
      ? convertTimestampToString(createdDate)
      : undefined,
    lastUpdatedDate: lastUpdatedDate
      ? convertTimestampToString(lastUpdatedDate)
      : undefined,
  };
};

const initialState: FlashcardsState = { flashcards: {} };

export const useFlashcardsStore = defineStore({
  id: "flashcards",
  state: () => initialState,
  actions: {
    async fetch() {
      const flashcards = await getFlashcardsFirestore();
      this.flashcards = Object.entries(flashcards).reduce<
        FlashcardsState["flashcards"]
      >((acc, [id, firestoreFlashcard]) => {
        acc[id] = convertFirestoreFlashcard(firestoreFlashcard);
        return acc;
      }, {});
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
      const [id, firestoreFlashcard] = await createFlashcardFirestore({
        front,
        back,
        tags,
      });
      this.flashcards[id] = convertFirestoreFlashcard(firestoreFlashcard);
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
      const [, { lastUpdatedDate }] = await updateFlashcardFirestore(id, {
        front,
        back,
        tags,
      });
      this.flashcards[id] = {
        ...this.flashcards[id],
        front,
        back,
        tags,
        lastUpdatedDate: convertTimestampToString(lastUpdatedDate),
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
