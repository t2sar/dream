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

const apiKey = firebaseConfig?.apiKey || (firebaseConfig as any)?.default?.apiKey;

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

const safeJoin = (args: any[]) => {
  try {
    return args.map(a => {
      try { return String(a); } catch(e) { return ''; }
    }).join(' ');
  } catch(e) {
    return '';
  }
};

console.error = function (...args) {
  if (filterFirestoreQuotaLog(safeJoin(args))) return;
  originalConsoleError.apply(console, args);
};

console.warn = function (...args) {
  if (filterFirestoreQuotaLog(safeJoin(args))) return;
  originalConsoleWarn.apply(console, args);
};

console.log = function (...args) {
  if (filterFirestoreQuotaLog(safeJoin(args))) return;
  originalConsoleLog.apply(console, args);
};

const configToUse = firebaseConfig?.apiKey ? firebaseConfig : (firebaseConfig as any)?.default;
if (configToUse && configToUse.apiKey) {
  configToUse.apiKey = configToUse.apiKey.trim();
}

if (configToUse?.apiKey && configToUse.apiKey.length > 10) {
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
  let docFetched = false;
  let logsFetched = false;
  
  const notifyUpdate = () => {
    console.log(`[Sync Debug] notifyUpdate called: docFetched=${docFetched}, logsFetched=${logsFetched}`);
    console.log(`[Sync Debug] Auth State: user=${auth?.currentUser?.uid}, sync mode active`);
    if (docFetched && logsFetched) {
      if (currentData) {
        const payload = {
          ...currentData,
          logs: { ...(currentData.logs || {}), ...currentLogs }
        };
        console.log(`[Sync Debug] Payload generated, size stringified approx: ${JSON.stringify(payload).length} bytes`);
        onUpdate(payload);
      } else {
        console.log(`[Sync Debug] No main document found for user, pushing null to fallback.`);
        onUpdate(null);
      }
    }
  };

  let unsubDoc: () => void = () => {};
  let unsubLogs: () => void = () => {};

  unsubDoc = onSnapshot(doc(dbInstance, "users", userId), (docSnap) => {
    docFetched = true;
    console.log(`[Firestore Read] Main user document fetched for ${userId}. Exists: ${docSnap.exists()}`);
    if (docSnap.exists()) {
      currentData = docSnap.data();
    } else {
      currentData = null;
    }
    notifyUpdate();
  }, (error) => {
    console.error(`[Firestore Read] Error fetching main user document for ${userId}`, error);
    if (error?.code === 'resource-exhausted' || (error?.message && error.message.includes('Quota exceeded'))) {
      enterOfflineMode();
      onUpdate(null);
      unsubDoc();
    } else {
      const errInfo = { error: error instanceof Error ? error.message : String(error), operationType: OperationType.GET, path: pathForGetDocs, authInfo: { userId: auth?.currentUser?.uid, email: auth?.currentUser?.email } };
      console.error('Firestore Error: ', JSON.stringify(errInfo));
      onUpdate(null);
      unsubDoc();
    }
  });

  unsubLogs = onSnapshot(collection(dbInstance, "users", userId, "logs"), (collSnap) => {
    logsFetched = true;
    console.log(`[Firestore Read] Logs collection fetched for ${userId}. Snapshot size: ${collSnap.size} documents`);
    collSnap.docChanges().forEach((change) => {
      // Each doc is a YYYY-MM record
      Object.assign(currentLogs, change.doc.data());
    });
    notifyUpdate();
  }, (error) => {
    console.error(`[Firestore Read] Error fetching logs collection for ${userId}`, error);
    if (error?.code === 'resource-exhausted' || (error?.message && error.message.includes('Quota exceeded'))) {
      enterOfflineMode();
      onUpdate(null);
      unsubLogs();
    } else {
      const errInfo = { error: error instanceof Error ? error.message : String(error), operationType: OperationType.LIST, path: `${pathForGetDocs}/logs`, authInfo: { userId: auth?.currentUser?.uid, email: auth?.currentUser?.email } };
      console.error('Firestore Error: ', JSON.stringify(errInfo));
      onUpdate(null);
      unsubLogs();
    }
  });

  return () => {
    unsubDoc();
    unsubLogs();
  };
};

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let pendingData: any = null;
let pendingUserId: string | null = null;
let pendingUpdatesPromise: Promise<void> | null = null;
let pendingUpdatesResolve: (() => void) | null = null;
const lastSavedMonthHashes: Record<string, string> = {};

let isExecutingSave = false;

const executeSave = async () => {
  if (isExecutingSave) return;
  
  if (!pendingData || !pendingUserId) {
    if (pendingUpdatesResolve) pendingUpdatesResolve();
    pendingUpdatesPromise = null;
    pendingUpdatesResolve = null;
    return;
  }
  
  isExecutingSave = true;
  const dataToSave = pendingData;
  const userId = pendingUserId;
  pendingData = null;
  pendingUserId = null;
  const currentResolve = pendingUpdatesResolve;
  const pathForWrite = `users/${userId}`;
  
  try {
    const { logs, ...mainData } = dataToSave;
    
    const cleanMainData = { ...mainData, lastUpdated: Date.now() };
    
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
    console.log(`[Firestore Write] Successfully saved user data for ${userId}`);
  } catch (e: any) {
    console.error(`[Firestore Write] Error saving user data for ${userId}:`, e);
    if (e?.code === 'resource-exhausted' || (e?.message && e.message.includes('Quota exceeded'))) {
      await enterOfflineMode();
    } else {
      handleFirestoreError(e, OperationType.WRITE, `users/${userId}`);
    }
  } finally {
    isExecutingSave = false;
    if (currentResolve) currentResolve();
    // Only nullify if we haven't picked up a new promise via a nested saveUserData call
    if (pendingUpdatesResolve === currentResolve) {
      pendingUpdatesPromise = null;
      pendingUpdatesResolve = null;
    }
    
    // If more data queued up while we were saving, trigger it immediately
    if (pendingData) {
       await executeSave();
    }
  }
};

export const flushPendingSaves = async () => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
        saveTimeout = null;
        await executeSave();
    }
    
    if (pendingUpdatesPromise) {
        await pendingUpdatesPromise;
    }
};

export const saveUserData = async (userId: string, data: { habits: Habit[], logs: HabitLog, slipLogs?: HabitLog, extraStats?: any, activeRestMode?: any }): Promise<void> => {
  if (!dbInstance || isQuotaExceeded) return;
  console.log(`[Firestore Write] saveUserData called for user ${userId} with ${data.habits.length} habits`);
  
  pendingData = data;
  pendingUserId = userId;
  
  if (!pendingUpdatesPromise) {
    pendingUpdatesPromise = new Promise((resolve) => {
      pendingUpdatesResolve = resolve;
    });
  }

  if (saveTimeout) clearTimeout(saveTimeout);
  
  saveTimeout = setTimeout(executeSave, 500); 

  return pendingUpdatesPromise;
};

export const syncLocalDataToCloud = async (userId: string, localHabits: Habit[], localLogs: HabitLog, extraStats?: any, activeRestMode?: any, localTimestamp?: number) => {
  if (!dbInstance || isQuotaExceeded) return false;
  const pathForWrite = `users/${userId}`;

  console.log(`[Sync Debug] syncLocalDataToCloud attempt for ${userId}. Local habits count: ${localHabits.length}, logs count: ${Object.keys(localLogs).length}, local TS: ${localTimestamp}`);

  try {
    const userRef = doc(dbInstance, "users", userId);
    const snapshot = await getDoc(userRef);

    let shouldOverwrite = false;
    let remoteTimestamp = 0;
    
    if (snapshot.exists()) {
      remoteTimestamp = snapshot.data()?.lastUpdated || 0;
      if (localTimestamp && localTimestamp > remoteTimestamp + 5000) {
        shouldOverwrite = true;
        console.log(`[Sync Debug] Conflict resolved: Local cache (${localTimestamp}) is newer than Remote (${remoteTimestamp}). Overwriting remote...`);
      }
    } else {
      shouldOverwrite = true;
      console.log(`[Sync Debug] No remote document exists for ${userId}. Initiating overwrite from local cache.`);
    }

    if (shouldOverwrite) {
      const cleanData = {
        habits: localHabits,
        extraStats: extraStats || null,
        activeRestMode: activeRestMode || null,
        createdAt: new Date().toISOString(),
        lastUpdated: localTimestamp || Date.now()
      };
      await setDoc(userRef, cleanData);

      // Save initial logs to subcollections
      const logsByMonth: Record<string, HabitLog> = {};
      for (const [dateStr, ids] of Object.entries(localLogs || {}) as [string, string[]][]) {
        const monthPrefix = dateStr.substring(0, 7);
        if (!logsByMonth[monthPrefix]) logsByMonth[monthPrefix] = {};
        logsByMonth[monthPrefix][dateStr] = ids;
      }
      let totalLogsSize = 0;
      for (const [month, monthLogs] of Object.entries(logsByMonth)) {
        const monthHash = JSON.stringify(monthLogs);
        totalLogsSize += monthHash.length;
        await setDoc(doc(dbInstance, "users", userId, "logs", month), JSON.parse(monthHash), { merge: true });
        lastSavedMonthHashes[month] = monthHash;
      }
      
      console.log(`[Sync Debug] Successfully created new document and synced local data. Approx logs payload size: ${totalLogsSize} bytes`);
      return true; 
    }
    
    console.log(`[Sync Debug] Document already exists for ${userId}. Skipping local overwrite. Document reference conflict: Local data is older or different.`);
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