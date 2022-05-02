import {
  // doc,
  addDoc,
  // setDoc,
  // getDoc,
  getDocs,
  // query,
  // updateDoc,
  collection,
  // where,
  // documentId,
} from "firebase/firestore";
import { firestore } from "../app";
import { throwOrGetCurrentUserUID } from "../core";

const getUserTagsCollectionRef = (uid: string) =>
  collection(firestore, `/users/${uid}/tags`);

const getUserFlashcardsCollectionRef = (uid: string) =>
  collection(firestore, `/users/${uid}/flashcards`);

export const getTags = async (): Promise<Record<string, { name: string }>> => {
  const uid = throwOrGetCurrentUserUID();
  const snapshot = await getDocs(getUserTagsCollectionRef(uid));
  const tags: Record<string, { name: string }> = {};
  snapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    tags[doc.id] = { name: doc.data().name };
  });
  return tags;
};

export const createTag = async ({
  name,
}: {
  name: string;
}): Promise<string> => {
  const uid = throwOrGetCurrentUserUID();
  const docRef = await addDoc(getUserTagsCollectionRef(uid), { name });
  return docRef.id;
};

export const getFlashcards = async (): Promise<
  Record<string, { front: string; back: string; tags: Array<string> }>
> => {
  const uid = throwOrGetCurrentUserUID();
  const snapshot = await getDocs(getUserFlashcardsCollectionRef(uid));
  const flashcards: Record<
    string,
    { front: string; back: string; tags: Array<string> }
  > = {};
  snapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    flashcards[doc.id] = {
      front: doc.data().front,
      back: doc.data().back,
      tags: doc.data().tags,
    };
  });
  return flashcards;
};

export const createFlashcard = async ({
  front,
  back,
  tags,
}: {
  front: string;
  back: string;
  tags: Array<string>;
}): Promise<string> => {
  const uid = throwOrGetCurrentUserUID();
  const docRef = await addDoc(getUserFlashcardsCollectionRef(uid), {
    front,
    back,
    tags,
  });
  return docRef.id;
};
