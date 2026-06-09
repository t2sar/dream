import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  AuthError,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
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
import firebaseConfig from "../firebase-applet-config.json";

const apiKey = firebaseConfig.apiKey || (firebaseConfig as any).default?.apiKey;

console.error("DEBUG FIREBASE CONFIG:", firebaseConfig);

if (!apiKey) {
  console.log("Firebase config loaded as:", firebaseConfig);
}

// Initialize App
let app: any = null;
let authInstance: any = null;
let dbInstance: any = null;

const configToUse = firebaseConfig.apiKey ? firebaseConfig : (firebaseConfig as any).default;
if (configToUse && configToUse.apiKey) {
  configToUse.apiKey = configToUse.apiKey.trim();
}

if (apiKey && apiKey.length > 10) {
  try {
    app = initializeApp(configToUse);
    authInstance = getAuth(app);

    dbInstance = initializeFirestore(app, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED
    }, firebaseConfig.firestoreDatabaseId);

    enableIndexedDbPersistence(dbInstance).catch((err) => {
        console.debug('Persistence disabled:', err.code);
    });
  } catch (e) {
    console.error("Firebase init error", e);
  }
}

// Mock auth for fast-failing without crashing the app boundary
export const auth = authInstance || ({
  currentUser: null,
} as any);

export const db = dbInstance || ({} as any);

export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  
  // Try to parse the error message. If it includes "Missing or insufficient permissions.", format as JSON
  if (errInfo.error.toLowerCase().includes('missing or insufficient permissions')) {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }
  throw error;
}

export const subscribeToUserData = (userId: string, onUpdate: (data: any) => void) => {
  if (!dbInstance) {
    onUpdate(null);
    return () => {};
  }
  const pathForGetDocs = `users/${userId}`;
  return onSnapshot(doc(dbInstance, "users", userId), (doc) => {
    if (doc.exists()) {
      onUpdate(doc.data());
    } else {
      onUpdate(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, pathForGetDocs);
  });
};

export const saveUserData = async (userId: string, data: { habits: Habit[], logs: HabitLog }) => {
  if (!dbInstance) return;
  const pathForWrite = `users/${userId}`;
  try {
    await setDoc(doc(dbInstance, "users", userId), data, { merge: true });
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, pathForWrite);
  }
};

export const syncLocalDataToCloud = async (userId: string, localHabits: Habit[], localLogs: HabitLog) => {
  if (!dbInstance) return false;
  const pathForWrite = `users/${userId}`;
  try {
    const userRef = doc(dbInstance, "users", userId);
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
    // Only bubble up if it's a permission error, else it's a sync error over network
    if (error instanceof Error && error.message.toLowerCase().includes('missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.WRITE, pathForWrite);
    }
    console.error("Sync Error:", error);
    return false;
  }
};

export const loginWithGoogle = async () => {
  if (!apiKey || !authInstance) {
    throw new Error("Missing FIREBASE_API_KEY. Please set it in your Environment Variables (.env).");
  }
  
  try {
    await signInWithPopup(authInstance, googleProvider);
  } catch (error: any) {
    // Handle specific error codes
    const code = error.code;
    const msg = error.message;

    if (code === 'auth/cancelled-popup-request') {
      throw new Error("Login cancelled by user.");
    }
    if (code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.' || code === 'auth/invalid-api-key') {
      throw new Error("Invalid API Key configuration.");
    }
    if (code === 'auth/popup-closed-by-user') {
       throw new Error("Login popup closed.");
    }
    
    console.error("Login Error Detailed:", code, msg);
    throw error;
  }
};

export const logout = () => {
  if (authInstance) return signOut(authInstance);
  return Promise.resolve();
};

export const loginWithEmail = async (email: string, password: string) => {
  if (!apiKey || !authInstance) {
    throw new Error("Missing FIREBASE_API_KEY. Please set it in your Environment Variables (.env).");
  }
  try {
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (error: any) {
    const code = error.code;
    if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
      throw new Error("Invalid email or password.");
    }
    if (code === 'auth/invalid-email') {
      throw new Error("Invalid email format.");
    }
    throw new Error(error.message || "Failed to sign in.");
  }
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  if (!apiKey || !authInstance) {
    throw new Error("Missing FIREBASE_API_KEY. Please set it in your Environment Variables (.env).");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
  } catch (error: any) {
    const code = error.code;
    if (code === 'auth/email-already-in-use') {
      throw new Error("This email is already registered.");
    }
    if (code === 'auth/weak-password') {
      throw new Error("Password is too weak. Must be at least 6 characters.");
    }
    if (code === 'auth/invalid-email') {
      throw new Error("Invalid email format.");
    }
    throw new Error(error.message || "Failed to sign up.");
  }
};