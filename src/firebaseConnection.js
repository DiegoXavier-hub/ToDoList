
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyD53iqrPjZ_I3LmvzueNBy6nI7E0IKKZWY",
    authDomain: "todolist-7068d.firebaseapp.com",
    projectId: "todolist-7068d",
    storageBucket: "todolist-7068d.appspot.com",
    messagingSenderId: "902983475888",
    appId: "1:902983475888:web:80e113a4d551e18e849175",
    measurementId: "G-CPBV1SFREW"
}

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { db, auth }