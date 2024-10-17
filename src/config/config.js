
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

export const DB_Usuarios = {
    apiKey: "AIzaSyCHR14xHX5qDqCGkIdGN6gqVoFWYpIHbH4",
    authDomain: "usuarios-5292b.firebaseapp.com",
    projectId: "usuarios-5292b",
    storageBucket: "usuarios-5292b.appspot.com",
    messagingSenderId: "275166809061",
    appId: "1:275166809061:web:493eb3bddc9a260961bd0c",
    measurementId: "G-Z1RZ2KHSMD"
  };

const app = initializeApp(DB_Usuarios);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };