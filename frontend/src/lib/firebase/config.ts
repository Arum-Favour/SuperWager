// import { initializeApp } from 'firebase/app';
// import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
// import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// // Check if we're in development and don't have real Firebase config
// const isDevelopment = process.env.NODE_ENV === 'development';
// const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
//                           process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize services
// export const db = getFirestore(app);
// export const functions = getFunctions(app);

// // In development without real config, don't connect to cloud
// if (isDevelopment && !hasFirebaseConfig) {
//   console.log('🔥 Firebase running in development mode with mock data');
  
//   // Optionally connect to local emulators if you have them running
//   // Uncomment these lines if you want to use Firebase emulators
//   /*
//   try {
//     connectFirestoreEmulator(db, 'localhost', 8080);
//     connectFunctionsEmulator(functions, 'localhost', 5001);
//   } catch (error) {
//     console.log('Firebase emulators not available, using mock data');
//   }
//   */
// }

// export default app;

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required config values are present
const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

if (!hasFirebaseConfig) {
  console.error('❌ Missing Firebase configuration. Please check your environment variables.');
  console.log('Required env vars:', Object.keys(firebaseConfig));
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Only use emulators in development if explicitly enabled
const USE_EMULATORS = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true';

if (USE_EMULATORS) {
  console.log('🔧 Connecting to Firebase emulators...');
  
  try {
    // Connect to Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    
    // Connect to Auth emulator  
    connectAuthEmulator(auth, 'http://localhost:9099');
    
    console.log('✅ Connected to Firebase emulators');
  } catch (error) {
    console.warn('⚠️ Could not connect to Firebase emulators:', error);
  }
} else {
  console.log('🔥 Using production Firebase configuration');
  console.log('Project ID:', firebaseConfig.projectId);
}

export default app;