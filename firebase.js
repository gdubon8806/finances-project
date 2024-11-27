// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js'
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBd49Ae2RGoj-RYN1iNm25YnGdfs-HHmWE",
    authDomain: "my-finances-7d664.firebaseapp.com",
    projectId: "my-finances-7d664",
    storageBucket: "my-finances-7d664.firebasestorage.app",
    messagingSenderId: "775079394084",
    appId: "1:775079394084:web:604907ad565f23485e51b1",
    measurementId: "G-5KT2ZQMRXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function createEntry(data) {
    try {
        const docRef = await addDoc(collection(db, "entries"), {
          description: data.description,
          date: data.date,
          amount: data.amount,
          type: data.type
        });
        console.log("Entry written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding entry: ", e);
      }
}

export async function readEntry() {
    const  entries = [];
    const querySnapshot  = await getDocs(collection(db, "entries"));
    
    querySnapshot.forEach((doc) => {
        const entry = {
            id: doc.id,
            description: doc.data().description,
            date: doc.data().date,
            amount: doc.data().amount,
            type: doc.data().type
        }
        entries.push(entry);
    })

    return entries; 
}

export async function updateEntry(id, newData) {
    await updateDoc(id, {
        amount: newData.amount,
        date: newData.date,
        description: newData.description,
        type: newData.type
    })
    console.log("Entry was updated succesfully!");
}

export async function deleteEntry(id) {
    await deleteDoc(doc(db, "entries", id));
    console.log("Entry deleted successfully!")
}
