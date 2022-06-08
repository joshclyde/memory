import { Timestamp } from "firebase/firestore";

export interface FirestoreComputedFields {
  createdDate: Timestamp;
  lastModified: Timestamp;
  isDeleted?: boolean;
}

export interface FirestoreTagUserInput {
  name: string;
}

export interface FirestoreTag
  extends FirestoreTagUserInput,
    FirestoreComputedFields {}

export interface FirestoreFlashcardUserInput {
  front: string;
  back: string;
  tags: Array<string>;
}

export interface FirestoreFlashcard
  extends FirestoreFlashcardUserInput,
    FirestoreComputedFields {}
