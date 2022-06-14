import { defineStore } from "pinia";
import { createReview, fetchReviews } from "src/firebase";
import { convertComputedFields } from "src/utils/firestore";
import { FirestoreReviewUserInput } from "src/firebase/firestore/types";
import { StateReview } from "./types";

export interface ReviewsState {
  reviews: Record<string, StateReview>;
}

const initialState: ReviewsState = { reviews: {} };

export const useReviewsStore = defineStore({
  id: "reviews",
  state: () => initialState,
  actions: {
    clear() {
      this.reviews = {};
    },
    async fetch() {
      const firestoreReviews = await fetchReviews();
      Object.entries(firestoreReviews).forEach(([id, firestoreReview]) => {
        this.reviews[id] = convertComputedFields(firestoreReview);
      });
    },
    async create(data: FirestoreReviewUserInput) {
      const [id, firestoreReview] = await createReview(data);
      this.reviews[id] = convertComputedFields(firestoreReview);
      return id;
    },
  },
  getters: {},
});
