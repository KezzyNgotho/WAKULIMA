import firebase from'@react-native-firebase/app';
import '@react-native-firebase/auth';;
import '@react-native-firebase/firestore' ;// Import other Firebase services as needed

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyD9D7JDO9S7FGo06OhiskKzpBvcivpv0j8",
  authDomain: "charles-8ac58.firebaseapp.com",
  databaseURL: "https://charles-8ac58-default-rtdb.firebaseio.com",
  projectId: "charles-8ac58",
  storageBucket: "charles-8ac58.appspot.com",
  messagingSenderId: "723052898724",
  appId: "1:723052898724:web:8819c07e9c2a33b3a43931",
  measurementId: "G-82ZHS0JHK7"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase;
