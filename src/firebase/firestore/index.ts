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
} from 'firebase/firestore';
import { firestore } from '../app';
import { throwOrGetCurrentUserUID } from '../core';

const getUserTagsCollectionRef = (uid: string) => collection(firestore, `/users/${uid}/tags`);

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
