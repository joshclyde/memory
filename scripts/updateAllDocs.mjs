import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

/*
  Running this script allows you to update all docs within a collection.

  Might want to backup your firestore data just in case something goes wrong.
*/
(async () => {
  /*
  Make sure to set the google credentials in your current shell session.

  export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
*/
  initializeApp({
    credential: applicationDefault(),
    databaseURL: "https://memory-josh-clyde-default-rtdb.firebaseio.com",
  });

  console.log("App initialized");

  const firestore = getFirestore();

  /*
    Important! Change the doc path to what you want.
  */
  const snapshot = await firestore
    .collection("/users/someUserId/someCollection")
    .get();

  const ids = [];

  snapshot.forEach((_doc) => {
    const { id } = _doc;
    // If you need access to the data within each doc
    // const data = _doc.data();
    ids.push(id);
  });

  console.log("Successful document retrieval");
  console.log(`Ids - ${ids}`);

  const writeLastModified = async () => {
    if (ids.length > 0) {
      const id = ids.pop();
      /*
        Important! Change the doc path to what you want.
      */
      await firestore.doc(`/users/someUserId/someCollection/${id}`).update({
        /*
          Important! Add any fields you want to change.

          e.g.
          lastModified: Timestamp.now()

        */
      });
      console.log(`Updated - ${id}`);
      writeLastModified();
    }
  };
  writeLastModified();
})();
