import { Timestamp } from "firebase/firestore";

export const convertTimestampToString = (timestamp: Timestamp) =>
  timestamp.toDate().toString();
