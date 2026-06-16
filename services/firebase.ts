import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  AuthError,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
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
  collection,
  disableNetwork
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

export let isQuotaExceeded = false;
try {
  isQuotaExceeded = localStorage.getItem("firestore_quota_exceeded") === "true";
} catch (e) {}

export const enterOfflineMode = async () => {
  if (!dbInstance) return;
  if (isQuotaExceeded) return; // Prevent multiple calls
  try {
    isQuotaExceeded = true;
    localStorage.setItem("firestore_quota_exceeded", "true");
    console.warn("Firestore quota exceeded/exhausted. Switching to Offline Mode.");
    await disableNetwork(dbInstance);
  } catch (e) {
    console.error("Failed to disable Firestore network:", e);
  }
};

// Intercept console messages to catch Firebase SDK's internal background sync quota errors
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

const filterFirestoreQuotaLog = (msg: string) => {
  if (typeof msg === 'string' && (msg.includes('resource-exhausted') || msg.includes('Quota exceeded') || msg.includes('Quota limit exceeded') || msg.includes('Using maximum backoff delay'))) {
    enterOfflineMode();
    return true; // Should filter
  }
  return false;
};

console.error = function (...args) {
  if (filterFirestoreQuotaLog(args.join(' '))) return;
  originalConsoleError.apply(console, args);
};

console.warn = function (...args) {
  if (filterFirestoreQuotaLog(args.join(' '))) return;
  originalConsoleWarn.apply(console, args);
};

console.log = function (...args) {
  if (filterFirestoreQuotaLog(args.join(' '))) return;
  originalConsoleLog.apply(console, args);
};

const configToUse = firebaseConfig.apiKey ? firebaseConfig : (firebaseConfig as any).default;
if (configToUse && configToUse.apiKey) {
  configToUse.apiKey = configToUse.apiKey.trim();
}

if (apiKey && apiKey.length > 10) {
  try {
    app = initializeApp(configToUse);
    authInstance = getAuth(app);

    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);

    try {
      enableIndexedDbPersistence(dbInstance).catch((err) => {
          console.debug('Persistence disabled asynchronously:', err.code);
      });
    } catch (persistErr) {
      console.debug('Persistence disabled synchronously:', persistErr);
    }

    if (isQuotaExceeded) {
      console.warn("Firestore quota was previously exceeded. Initializing Firestore in Offline Mode.");
      disableNetwork(dbInstance).catch((e) => {
        console.error("Failed to enter offline mode during initialization:", e);
      });
    }
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
  const errObj = error as any;
  if (errObj?.code === 'resource-exhausted' || (errObj?.message && errObj.message.includes('Quota exceeded'))) {
    console.warn("Firestore quota limit exceeded detected in handleFirestoreError. Switching to offline mode.");
    enterOfflineMode();
    return;
  }

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
  if (!dbInstance || isQuotaExceeded) {
    onUpdate(null);
    return () => {};
  }
  const pathForGetDocs = `users/${userId}`;
  
  let currentData: any = null;
  const currentLogs: any = {};
  let isFirstDocFetch = true;
  
  const notifyUpdate = () => {
    if (currentData) {
      onUpdate({
        ...currentData,
        logs: { ...(currentData.logs || {}), ...currentLogs }
      });
    }
  };

  let unsubDoc: () => void = () => {};
  let unsubLogs: () => void = () => {};

  unsubDoc = onSnapshot(doc(dbInstance, "users", userId), (docSnap) => {
    if (docSnap.exists()) {
      currentData = docSnap.data();
      if (!isFirstDocFetch) notifyUpdate();
      isFirstDocFetch = false;
    } else {
      onUpdate(null);
    }
  }, (error) => {
    if (error?.code === 'resource-exhausted' || (error?.message && error.message.includes('Quota exceeded'))) {
      enterOfflineMode();
      onUpdate(null);
      unsubDoc();
    } else {
      handleFirestoreError(error, OperationType.GET, pathForGetDocs);
    }
  });

  unsubLogs = onSnapshot(collection(dbInstance, "users", userId, "logs"), (collSnap) => {
    collSnap.docChanges().forEach((change) => {
      // Each doc is a YYYY-MM record
      Object.assign(currentLogs, change.doc.data());
    });
    if (currentData && !isFirstDocFetch) notifyUpdate();
  }, (error) => {
    if (error?.code === 'resource-exhausted' || (error?.message && error.message.includes('Quota exceeded'))) {
      enterOfflineMode();
      onUpdate(null);
      unsubLogs();
    } else {
      handleFirestoreError(error, OperationType.LIST, `${pathForGetDocs}/logs`);
    }
  });

  return () => {
    unsubDoc();
    unsubLogs();
  };
};

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let pendingData: any = null;
let pendingUpdatesPromise: Promise<void> | null = null;
let pendingUpdatesResolve: (() => void) | null = null;
const lastSavedMonthHashes: Record<string, string> = {};

export const saveUserData = async (userId: string, data: { habits: Habit[], logs: HabitLog, slipLogs?: HabitLog, extraStats?: any, activeRestMode?: any }): Promise<void> => {
  if (!dbInstance || isQuotaExceeded) return;
  
  pendingData = data;
  
  if (!pendingUpdatesPromise) {
    pendingUpdatesPromise = new Promise((resolve) => {
      pendingUpdatesResolve = resolve;
    });
  }

  if (saveTimeout) clearTimeout(saveTimeout);
  
  saveTimeout = setTimeout(async () => {
    const dataToSave = pendingData;
    pendingData = null;
    const pathForWrite = `users/${userId}`;
    try {
      const { logs, ...mainData } = dataToSave;
      
      const cleanMainData = mainData;
      
      await setDoc(doc(dbInstance, "users", userId), cleanMainData, { merge: true });

      const logsByMonth: Record<string, HabitLog> = {};
      for (const [dateStr, ids] of Object.entries(logs || {}) as [string, string[]][]) {
        const monthPrefix = dateStr.substring(0, 7); // YYYY-MM
        if (!logsByMonth[monthPrefix]) logsByMonth[monthPrefix] = {};
        logsByMonth[monthPrefix][dateStr] = ids;
      }

      for (const [month, monthLogs] of Object.entries(logsByMonth)) {
        const monthHash = JSON.stringify(monthLogs);
        if (lastSavedMonthHashes[month] !== monthHash) {
           const monthDocRef = doc(dbInstance, "users", userId, "logs", month);
           await setDoc(monthDocRef, JSON.parse(monthHash), { merge: true });
           lastSavedMonthHashes[month] = monthHash;
        }
      }
    } catch (e: any) {
      if (e?.code === 'resource-exhausted' || (e?.message && e.message.includes('Quota exceeded'))) {
        await enterOfflineMode();
      } else {
        handleFirestoreError(e, OperationType.WRITE, `users/${userId}`);
      }
    } finally {
      if (pendingUpdatesResolve) pendingUpdatesResolve();
      pendingUpdatesPromise = null;
      pendingUpdatesResolve = null;
    }
  }, 10000); // 10 seconds debounce to save quota

  return pendingUpdatesPromise;
};

export const syncLocalDataToCloud = async (userId: string, localHabits: Habit[], localLogs: HabitLog, activeRestMode?: any) => {
  if (!dbInstance || isQuotaExceeded) return false;
  const pathForWrite = `users/${userId}`;

  try {
    const userRef = doc(dbInstance, "users", userId);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const cleanData = {
        habits: localHabits,
        activeRestMode: activeRestMode || null,
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, cleanData);

      // Save initial logs to subcollections
      const logsByMonth: Record<string, HabitLog> = {};
      for (const [dateStr, ids] of Object.entries(localLogs || {}) as [string, string[]][]) {
        const monthPrefix = dateStr.substring(0, 7);
        if (!logsByMonth[monthPrefix]) logsByMonth[monthPrefix] = {};
        logsByMonth[monthPrefix][dateStr] = ids;
      }
      for (const [month, monthLogs] of Object.entries(logsByMonth)) {
        const monthHash = JSON.stringify(monthLogs);
        await setDoc(doc(dbInstance, "users", userId, "logs", month), JSON.parse(monthHash), { merge: true });
        lastSavedMonthHashes[month] = monthHash;
      }

      return true; 
    }
    return false; 
  } catch (error: any) {
    if (error?.code === 'resource-exhausted' || (error?.message && error.message.includes('Quota exceeded'))) {
      await enterOfflineMode();
      return false;
    }
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

export const resetPassword = async (email: string) => {
  if (!apiKey || !authInstance) {
    throw new Error("Missing FIREBASE_API_KEY. Please set it in your Environment Variables (.env).");
  }
  try {
    await sendPasswordResetEmail(authInstance, email);
  } catch (error: any) {
    const code = error.code;
    if (code === 'auth/user-not-found') {
      throw new Error("No account found with this email address.");
    }
    if (code === 'auth/invalid-email') {
      throw new Error("Invalid email format.");
    }
    throw new Error(error.message || "Failed to send password reset email.");
  }
};