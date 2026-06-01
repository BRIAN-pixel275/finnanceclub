import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Replace these with your Firebase project credentials
// Get these from Firebase Console -> Project Settings
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.databaseURL &&
    !firebaseConfig.apiKey?.includes('YOUR_') &&
    !firebaseConfig.projectId?.includes('YOUR_')
  );
};

// Initialize Firebase only if configured
let app: any = null;
let database: any = null;

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  } else {
    console.warn('Firebase is not configured. Sharing features will not work. Add environment variables to .env.local');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, database };
