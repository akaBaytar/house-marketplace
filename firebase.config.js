import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore'

// firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBesvPKwefBXKPZxoD50ElscsOFn3pUT_Y',
  authDomain: 'house-marketplace-7fcf6.firebaseapp.com',
  projectId: 'house-marketplace-7fcf6',
  storageBucket: 'house-marketplace-7fcf6.appspot.com',
  messagingSenderId: '922843943029',
  appId: '1:922843943029:web:0231dfa14eec871020683c',
};

// initialize firebase
initializeApp(firebaseConfig);

export const database = getFirestore()
