import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCaR39WZAPFqhxDooT9NR5LWf9GqPNlWQI",
  authDomain: "english-study-platform.firebaseapp.com",
  projectId: "english-study-platform",
  storageBucket: "english-study-platform.appspot.com",
  messagingSenderId: "698987553808",
  appId: "1:698987553808:web:334b4ec1ebc59f51581695",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
