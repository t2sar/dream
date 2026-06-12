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
  CACHE_SIZE_UNLIMITED,
  collection
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

    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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
  
  let currentData: any = null;
  let currentLogs: any = {};
  let isFirstDocFetch = true;
  
  const notifyUpdate = () => {
    if (currentData) {
      onUpdate({
        ...currentData,
        logs: { ...(currentData.logs || {}), ...currentLogs }
      });
    }
  };

  const unsubDoc = onSnapshot(doc(dbInstance, "users", userId), (docSnap) => {
    if (docSnap.exists()) {
      currentData = docSnap.data();
      if (!isFirstDocFetch) notifyUpdate();
      isFirstDocFetch = false;
    } else {
      onUpdate(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, pathForGetDocs);
  });

  const unsubLogs = onSnapshot(collection(dbInstance, "users", userId, "logs"), (collSnap) => {
    collSnap.docChanges().forEach((change) => {
      // Each doc is a YYYY-MM record
      Object.assign(currentLogs, change.doc.data());
    });
    if (currentData && !isFirstDocFetch) notifyUpdate();
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `${pathForGetDocs}/logs`);
  });

  return () => {
    unsubDoc();
    unsubLogs();
  };
};

export const saveUserData = async (userId: string, data: { habits: Habit[], logs: HabitLog, slipLogs?: HabitLog, extraStats?: any, activeRestMode?: any }) => {
  if (!dbInstance) return;
  const pathForWrite = `users/${userId}`;
  try {
    const { logs, ...mainData } = data;
    
    // Safe stringify to handle unexpected circular references
    const safeStringify = (obj: any) => {
      return JSON.stringify(obj, function(key, value) {
        if (typeof value !== 'object' || value === null) {
          return value;
        }
        if (value instanceof Element || (value && value._reactName) || value instanceof Event) {
            return undefined; 
        }
        return value;
      });
    };
    
    const cleanMainData = JSON.parse(safeStringify(mainData));
    await setDoc(doc(dbInstance, "users", userId), cleanMainData, { merge: true });

    // Sub-collections & Pagination (Delta Updates)
    const logsByMonth: Record<string, HabitLog> = {};
    for (const [dateStr, ids] of Object.entries(logs || {})) {
      const monthPrefix = dateStr.substring(0, 7); // YYYY-MM
      if (!logsByMonth[monthPrefix]) logsByMonth[monthPrefix] = {};
      logsByMonth[monthPrefix][dateStr] = ids;
    }

    for (const [month, monthLogs] of Object.entries(logsByMonth)) {
      const monthDocRef = doc(dbInstance, "users", userId, "logs", month);
      await setDoc(monthDocRef, JSON.parse(JSON.stringify(monthLogs)), { merge: true });
    }
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, pathForWrite);
  }
};

export const syncLocalDataToCloud = async (userId: string, localHabits: Habit[], localLogs: HabitLog, activeRestMode?: any) => {
  if (!dbInstance) return false;
  const pathForWrite = `users/${userId}`;
  
  // Safe stringify to handle unexpected circular references
  const safeStringify = (obj: any) => {
    return JSON.stringify(obj, function(key, value) {
      if (typeof value !== 'object' || value === null) {
        return value;
      }
      if (value instanceof Element || (value && value._reactName) || value instanceof Event) {
          return undefined; 
      }
      return value;
    });
  };

  try {
    const userRef = doc(dbInstance, "users", userId);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const cleanData = JSON.parse(safeStringify({
        habits: localHabits,
        activeRestMode: activeRestMode || null,
        createdAt: new Date().toISOString()
      }));
      await setDoc(userRef, cleanData);

      // Save initial logs to subcollections
      const logsByMonth: Record<string, HabitLog> = {};
      for (const [dateStr, ids] of Object.entries(localLogs || {})) {
        const monthPrefix = dateStr.substring(0, 7);
        if (!logsByMonth[monthPrefix]) logsByMonth[monthPrefix] = {};
        logsByMonth[monthPrefix][dateStr] = ids;
      }
      for (const [month, monthLogs] of Object.entries(logsByMonth)) {
        await setDoc(doc(dbInstance, "users", userId, "logs", month), JSON.parse(JSON.stringify(monthLogs)), { merge: true });
      }

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