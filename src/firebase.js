import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBFY6D4dg2Mcv9QwuRH-UsSyS5BvQFTVeg",
    authDomain: "mostafamossacoder.firebaseapp.com",
    projectId: "mostafamossacoder",
    storageBucket: "mostafamossacoder.appspot.com",
    messagingSenderId: "355547960663s",
    appId: "1:355547960663:web:ae313b99dff3b20ff11a12",
    measurementId: "G-1TL6QJ7ZHX"
}



const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

const db = app.firestore()
const auth = app.auth()
const provider = new firebase.auth.GoogleAuthProvider()


export { db, auth, provider }
