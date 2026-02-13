import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  AuthError
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  enableIndexedDbPersistence,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED 
} from "firebase/firestore";
import { Habit, HabitLog } from "../types";

// Helper to safely access process.env
const getEnv = (key: string) => {
  try {
    return process.env[key];
  } catch (e) {
    console.warn(`Error accessing process.env.${key}`, e);
    return undefined;
  }
};

// Fallback logic to try and find a valid key
// We trim whitespace to avoid "api-key-not-valid" errors from copy-paste
const apiKey = (
  getEnv('REACT_APP_FIREBASE_API_KEY') || 
  getEnv('FIREBASE_API_KEY') || 
  getEnv('API_KEY') || 
  ''
).trim();

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "t2sar-dream.firebaseapp.com",
  projectId: "t2sar-dream",
  storageBucket: "t2sar-dream.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

// Attempt persistence, but don't block app start if it fails
enableIndexedDbPersistence(db).catch((err) => {
    console.debug('Persistence disabled:', err.code);
});

export const subscribeToUserData = (userId: string, onUpdate: (data: any) => void) => {
  return onSnapshot(doc(db, "users", userId), (doc) => {
    if (doc.exists()) {
      onUpdate(doc.data());
    } else {
      onUpdate(null);
    }
  }, (error) => {
    console.error("Firestore Subscription Error:", error);
  });
};

export const saveUserData = async (userId: string, data: { habits: Habit[], logs: HabitLog }) => {
  try {
    await setDoc(doc(db, "users", userId), data, { merge: true });
  } catch (e) {
    console.error("Firestore Save Error:", e);
  }
};

export const syncLocalDataToCloud = async (userId: string, localHabits: Habit[], localLogs: HabitLog) => {
  try {
    const userRef = doc(db, "users", userId);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        habits: localHabits,
        logs: localLogs,
        createdAt: new Date().toISOString()
      });
      return true; 
    }
    return false; 
  } catch (error) {
    console.error("Sync Error:", error);
    return false;
  }
};

export const loginWithGoogle = async () => {
  if (!apiKey) {
    throw new Error("API Key is missing. Check configuration.");
  }
  
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    // Handle specific error codes
    const code = error.code;
    const msg = error.message;

    if (code === 'auth/cancelled-popup-request') {
      throw new Error("Login cancelled by user.");
    }
    if (code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
      throw new Error("Invalid API Key configuration.");
    }
    if (code === 'auth/popup-closed-by-user') {
       throw new Error("Login popup closed.");
    }
    
    console.error("Login Error Detailed:", code, msg);
    throw error;
  }
};

export const logout = () => signOut(auth);