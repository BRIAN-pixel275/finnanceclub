import {
  ref,
  set,
  get,
  onValue,
  update,
  remove,
} from 'firebase/database';
import type {
  DatabaseReference,
  Unsubscribe,
} from 'firebase/database';
import { database, isFirebaseConfigured } from '../config/firebase';
import type { AppState } from '../store/useStore';

const SHARE_CODES_PATH = 'shareCodes';
const DATA_PATH = 'sharedData';

// Check if Firebase operations are available
const isFirebaseAvailable = () => {
  if (!isFirebaseConfigured() || !database) {
    console.warn('Firebase is not configured. Sharing features are disabled.');
    return false;
  }
  return true;
};

// Generate a random 6-character alphanumeric code
export const generateShareCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Create or get a share code for the user
export const createShareCode = async (
  userId: string,
  clubName: string
): Promise<string> => {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not configured. Please add environment variables.');
  }

  const shareCode = generateShareCode();
  const codeRef = ref(database!, `${SHARE_CODES_PATH}/${shareCode}`);

  const codeData = {
    ownerId: userId,
    clubName,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    isActive: true,
  };

  await set(codeRef, codeData);
  return shareCode;
};

// Verify a share code exists and is active
export const verifyShareCode = async (shareCode: string): Promise<boolean> => {
  if (!isFirebaseAvailable()) {
    return false;
  }

  const codeRef = ref(database!, `${SHARE_CODES_PATH}/${shareCode}`);
  const snapshot = await get(codeRef);

  if (!snapshot.exists()) {
    return false;
  }

  const data = snapshot.val();
  if (!data.isActive) {
    return false;
  }

  const expiryDate = new Date(data.expiresAt);
  if (expiryDate < new Date()) {
    return false;
  }

  return true;
};

// Get share code owner ID
export const getShareCodeOwner = async (shareCode: string): Promise<string | null> => {
  if (!isFirebaseAvailable()) {
    return null;
  }

  const codeRef = ref(database!, `${SHARE_CODES_PATH}/${shareCode}`);
  const snapshot = await get(codeRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val().ownerId;
};

// Disable a share code
export const disableShareCode = async (shareCode: string): Promise<void> => {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not configured.');
  }

  const codeRef = ref(database!, `${SHARE_CODES_PATH}/${shareCode}/isActive`);
  await set(codeRef, false);
};
};

// Sync user's data to Firebase
export const syncDataToFirebase = async (
  _userId: string,
  shareCode: string,
  data: Partial<AppState>
): Promise<void> => {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not configured, skipping data sync.');
    return;
  }

  const dataRef = ref(database!, `${DATA_PATH}/${shareCode}`);

  const syncData = {
    transactions: data.transactions || [],
    receipts: data.receipts || [],
    auditLog: data.auditLog || [],
    settings: data.settings || {},
    notes: data.notes || '',
    lastUpdated: new Date().toISOString(),
  };

  await set(dataRef, syncData);
};

// Listen for data changes (for view-only users)
export const listenForDataChanges = (
  shareCode: string,
  onDataChange: (data: any) => void
): Unsubscribe | null => {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not configured, cannot listen for data changes.');
    return null as any;
  }

  const dataRef = ref(database!, `${DATA_PATH}/${shareCode}`);

  const unsubscribe = onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      onDataChange(snapshot.val());
    }
  });

  return unsubscribe;
};

// Get shared data once
export const getSharedData = async (shareCode: string): Promise<any> => {
  if (!isFirebaseAvailable()) {
    return null;
  }

  const dataRef = ref(database!, `${DATA_PATH}/${shareCode}`);
  const snapshot = await get(dataRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val();
};

// Revoke a share code (owner only)
export const revokeShareCode = async (shareCode: string, userId: string): Promise<boolean> => {
  if (!isFirebaseAvailable()) {
    return false;
  }

  const ownerId = await getShareCodeOwner(shareCode);

  if (ownerId !== userId) {
    console.error('User is not the owner of this share code');
    return false;
  }

  await disableShareCode(shareCode);
  return true;
};
