import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyC5PqXASyEcmsfn1Dl9rO7cG-twxDkTMH0",
  authDomain: "testapp-ddf1a.firebaseapp.com",
  databaseURL: "https://testapp-ddf1a-default-rtdb.firebaseio.com",
  projectId: "testapp-ddf1a",
  storageBucket: "testapp-ddf1a.appspot.com",
  messagingSenderId: "370306122569",
  appId: "1:370306122569:web:2bc21cb5c8ea8607915098",
  measurementId: "G-799L5CKRM3",
};


initializeApp(firebaseConfig)

const db = getFirestore()
const auth = getAuth()

export { db, auth }