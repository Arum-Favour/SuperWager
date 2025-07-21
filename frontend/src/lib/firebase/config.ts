import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Check if we're in development and don't have real Firebase config
const isDevelopment = process.env.NODE_ENV === 'development';
const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
                          process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const functions = getFunctions(app);

// In development without real config, don't connect to cloud
if (isDevelopment && !hasFirebaseConfig) {
  console.log('🔥 Firebase running in development mode with mock data');
  
  // Optionally connect to local emulators if you have them running
  // Uncomment these lines if you want to use Firebase emulators
  /*
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch (error) {
    console.log('Firebase emulators not available, using mock data');
  }
  */
}

export default app;