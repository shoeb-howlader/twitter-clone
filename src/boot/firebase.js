
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
//export default boot(async (/* { app, router, ... } */) => {
  // something to do

//})
// Your web app's Firebase configuration
const firebaseConfig = {
//your firebase credentials here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export default db
