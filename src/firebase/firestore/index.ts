import {
  doc,
  addDoc,
  // setDoc,
  // getDoc,
  getDocs,
  updateDoc,
  // query,
  // updateDoc,
  collection,
  // where,
  // documentId,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../app";
import { throwOrGetCurrentUserUID } from "../core";

const getUserTagsCollectionRef = (uid: string) =>
  collection(firestore, `/users/${uid}/tags`);

const getUserTagsDocumentRef = (uid: string, tagId: string) =>
  doc(firestore, `/users/${uid}/tags/${tagId}`);

const getUserFlashcardsCollectionRef = (uid: string) =>
  collection(firestore, `/users/${uid}/flashcards`);

const getUserFlashcardsDocumentRef = (uid: string, flashcardId: string) =>
  doc(firestore, `/users/${uid}/flashcards/${flashcardId}`);

export const getTags = async (): Promise<Record<string, { name: string }>> => {
  const uid = throwOrGetCurrentUserUID();
  const snapshot = await getDocs(getUserTagsCollectionRef(uid));
  const tags: Record<string, { name: string }> = {};
  snapshot.forEach((_doc) => {
    // _doc.data() is never undefined for query doc snapshots
    tags[_doc.id] = { name: _doc.data().name };
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

export const updateTag = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}): Promise<void> => {
  const uid = throwOrGetCurrentUserUID();
  await updateDoc(getUserTagsDocumentRef(uid, id), { name });
};

export const getFlashcards = async (): Promise<
  Record<
    string,
    {
      front: string;
      back: string;
      tags: Array<string>;
      /*
        createdDate and lastUpdatedDate are fields I added retroactively
        so older flashcards may not contain these fields
      */
      createdDate?: Timestamp;
      lastUpdatedDate?: Timestamp;
    }
  >
> => {
  const uid = throwOrGetCurrentUserUID();
  const snapshot = await getDocs(getUserFlashcardsCollectionRef(uid));
  const flashcards: Record<
    string,
    {
      front: string;
      back: string;
      tags: Array<string>;
      createdDate?: Timestamp;
      lastUpdatedDate?: Timestamp;
    }
  > = {};
  snapshot.forEach((_doc) => {
    // _doc.data() is never undefined for query doc snapshots
    const { id } = _doc;
    const { front, back, tags, createdDate, lastUpdatedDate } = _doc.data();
    flashcards[id] = {
      front,
      back,
      tags,
    };
    if (createdDate) {
      flashcards[id].createdDate = createdDate;
    }
    if (lastUpdatedDate) {
      flashcards[id].lastUpdatedDate = lastUpdatedDate;
    }
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
}): Promise<
  [
    string,
    {
      front: string;
      back: string;
      tags: Array<string>;
      createdDate: Timestamp;
      lastUpdatedDate: Timestamp;
    }
  ]
> => {
  const uid = throwOrGetCurrentUserUID();
  const now = Timestamp.now();
  const flashcardDoc = {
    front,
    back,
    tags,
    createdDate: now,
    lastUpdatedDate: now,
  };
  const docRef = await addDoc(
    getUserFlashcardsCollectionRef(uid),
    flashcardDoc
  );
  return [docRef.id, flashcardDoc];
};

export const updateFlashcard = async (
  id: string,
  {
    front,
    back,
    tags,
  }: {
    front: string;
    back: string;
    tags: Array<string>;
  }
): Promise<
  [
    string,
    {
      front: string;
      back: string;
      tags: Array<string>;
      lastUpdatedDate: Timestamp;
    }
  ]
> => {
  const uid = throwOrGetCurrentUserUID();
  const now = Timestamp.now();
  const flashcardDocUpdates = {
    front,
    back,
    tags,
    lastUpdatedDate: now,
  };
  await updateDoc(getUserFlashcardsDocumentRef(uid, id), flashcardDocUpdates);
  return [id, flashcardDocUpdates];
};
