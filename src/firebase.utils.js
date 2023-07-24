import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  collection,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB80I8aTILbkAViM1LdiW1fWpxUYDThdb4",
  authDomain: "register-f0b64.firebaseapp.com",
  projectId: "register-f0b64",
  storageBucket: "register-f0b64.appspot.com",
  messagingSenderId: "430309695852",
  appId: "1:430309695852:web:9e4e0223b5e639fbd49349",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

export const updateLogins = async (objectsToAdd) => {
  const collectionRef = collection(db, "logins");
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    console.log(object);
    const docRef = doc(collectionRef, object.email);
    batch.set(docRef, object);
  });
  await batch.commit();
  console.log("Registered to DB");
};

export const getLogins = async () => {
  const collectionRef = collection(db, "logins");
  const q = query(collectionRef);
  const querySnapshot = await getDocs(q);
  console.log("Got logins from DB");
  return querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
};
