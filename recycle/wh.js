  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
  import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAThMwHqKZRbIZtFpp6fCEy6xzFMGdGQ1k",
    authDomain: "warehouse-e7b00.firebaseapp.com",
    projectId: "warehouse-e7b00",
    storageBucket: "warehouse-e7b00.appspot.com",
    messagingSenderId: "396376414518",
    appId: "1:396376414518:web:9b2c84be67e19a81a03b97"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const docRef = await addDoc(collection(db, "months"), {
    mjesec: "02-2023",
  });

  console.log("Document written with ID: ", docRef.id);
