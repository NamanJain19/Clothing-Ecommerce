import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Read Firebase Web App configuration strictly from Vite environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ecommerce-6724e.firebaseapp.com';
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ecommerce-6724e';
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ecommerce-6724e.firebasestorage.app';
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '443589843872';
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

// Validate that required Firebase Web API Key & App ID are configured
if (!apiKey || apiKey.trim() === '') {
  console.warn(
    '[Firebase Notice] VITE_FIREBASE_API_KEY is not configured in website/.env'
  );
}

const firebaseConfig = {
  apiKey: apiKey || '',
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId: appId || '',
};

// Initialize Firebase safely (prevent multiple initialization)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Provider setup with explicit email and profile scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface GoogleAuthPayload {
  idToken: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  uid: string;
}

/**
 * Format Firebase Auth errors into clear, customer-friendly messages
 */
export const formatFirebaseAuthError = (error: any): string => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Google Sign-In was closed before completing.';
    case 'auth/popup-blocked':
      return 'Google Sign-In popup was blocked by your browser. Please allow popups for localhost:3008.';
    case 'auth/cancelled-popup-request':
      return 'Google Sign-In request was cancelled. Please try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Google Sign-In. Please ensure localhost:3008 is in Firebase Console Authorized Domains.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please verify your internet connection and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    case 'auth/invalid-api-key':
    case 'auth/app-not-authorized':
      return 'Firebase authentication service configuration error. Please check your Firebase settings.';
    default:
      return error?.message || 'Google Sign-In failed. Please try again.';
  }
};

/**
 * Trigger Firebase Google Sign-In popup and retrieve Google ID Token & profile data
 */
export const signInWithGoogle = async (): Promise<GoogleAuthPayload> => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      'Firebase API Key is missing. Please provide VITE_FIREBASE_API_KEY in website/.env.'
    );
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    // Extract real Google account properties from user and providerData
    const email = result.user.email || result.user.providerData?.[0]?.email || null;
    const displayName = result.user.displayName || result.user.providerData?.[0]?.displayName || null;
    const photoURL = result.user.photoURL || result.user.providerData?.[0]?.photoURL || null;
    const uid = result.user.uid;

    return {
      idToken,
      email,
      displayName,
      photoURL,
      uid,
    };
  } catch (error: any) {
    const friendlyMessage = formatFirebaseAuthError(error);
    throw new Error(friendlyMessage);
  }
};

export default app;
