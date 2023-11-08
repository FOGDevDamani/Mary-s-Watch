import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyD-53ZH8q69qLP4dtyh7k-7-jxYElVZZj0",

  authDomain: "maryswatch-71c87.firebaseapp.com",

  databaseURL: "https://maryswatch-71c87-default-rtdb.firebaseio.com",

  projectId: "maryswatch-71c87",

  storageBucket: "maryswatch-71c87.appspot.com",

  messagingSenderId: "1044992929674",

  appId: "1:1044992929674:web:f5065fd97958fb1c6ae273",

  measurementId: "G-BD02MFJQYW",
};


initializeApp(firebaseConfig)

const db = getFirestore()
const auth = getAuth()

export { db, auth }