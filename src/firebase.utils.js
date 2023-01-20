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
  apiKey: "AIzaSyCVltj_3-Wkwx64ytqV5_SPPDzaob3yn6g",
  authDomain: "kingswood-calendar-92872.firebaseapp.com",
  projectId: "kingswood-calendar-92872",
  storageBucket: "kingswood-calendar-92872.appspot.com",
  messagingSenderId: "743595071955",
  appId: "1:743595071955:web:bbd673371e8e92ae017726",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

export const updateSettings = async (objectsToAdd) => {
  const collectionRef = collection(db, "config");
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, "admin");
    batch.set(docRef, object);
  });
  await batch.commit();
  console.log("Done updating settings in DB");
};

export const getSettings = async () => {
  const collectionRef = collection(db, "config");
  const q = query(collectionRef);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
};
