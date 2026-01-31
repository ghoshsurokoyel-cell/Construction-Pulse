'use client';

import type { Auth } from 'firebase/auth';

let auth: Auth | null = null;
let firebaseInitError: Error | null = null;
let initialized = false;

export const isFirebaseEnabled = process.env.NEXT_PUBLIC_FIREBASE_ENABLED === 'true';

export const initFirebaseAuth = async (): Promise<{ auth: Auth | null; firebaseInitError: Error | null }> => {
  if (initialized) {
    console.log('[Firebase] Already initialized, returning cached result');
    return { auth, firebaseInitError };
  }
  
  console.log('[Firebase] Starting initialization...');
  initialized = true;

  if (!isFirebaseEnabled) {
    console.warn('[Firebase] Firebase authentication is disabled (NEXT_PUBLIC_FIREBASE_ENABLED is not "true")');
    firebaseInitError = new Error(
      'Firebase authentication is disabled. Set NEXT_PUBLIC_FIREBASE_ENABLED=true to enable.'
    );
    return { auth, firebaseInitError };
  }

  console.log('[Firebase] Firebase is enabled, gathering configuration...');

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || '',
  };

  console.log('[Firebase] Configuration gathered:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'MISSING',
    authDomain: firebaseConfig.authDomain || 'MISSING',
    projectId: firebaseConfig.projectId || 'MISSING',
    storageBucket: firebaseConfig.storageBucket || 'MISSING',
    messagingSenderId: firebaseConfig.messagingSenderId || 'MISSING',
    appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 15)}...` : 'MISSING',
  });

  const hasAllValues = Object.values(firebaseConfig).every(Boolean);
  const isLikelyApiKey = firebaseConfig.apiKey.startsWith('AIza') && firebaseConfig.apiKey.length > 30;
  const isLikelyAuthDomain =
    firebaseConfig.authDomain.includes('firebaseapp.com') ||
    firebaseConfig.authDomain.includes('web.app');

  if (!hasAllValues) {
    const missingKeys = Object.entries(firebaseConfig)
      .filter(([, value]) => !value)
      .map(([key]) => key);
    console.error('[Firebase] Missing configuration values:', missingKeys);
    firebaseInitError = new Error(
      `Missing Firebase web config values: ${missingKeys.join(', ')}. Check NEXT_PUBLIC_FIREBASE_* env vars.`
    );
    return { auth, firebaseInitError };
  }

  if (!isLikelyApiKey) {
    console.error('[Firebase] Invalid API key format (expected to start with "AIza" and be > 30 chars)');
    firebaseInitError = new Error(
      'Invalid Firebase API key format. Check NEXT_PUBLIC_FIREBASE_API_KEY env var.'
    );
    return { auth, firebaseInitError };
  }

  if (!isLikelyAuthDomain) {
    console.error('[Firebase] Invalid auth domain (expected to contain "firebaseapp.com" or "web.app")');
    firebaseInitError = new Error(
      'Invalid Firebase auth domain. Check NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN env var.'
    );
    return { auth, firebaseInitError };
  }

  console.log('[Firebase] Configuration validated successfully');

  try {
    console.log('[Firebase] Importing Firebase SDK modules...');
    const { initializeApp, getApps, getApp } = await import('firebase/app');
    const { getAuth } = await import('firebase/auth');
    
    console.log('[Firebase] SDK modules imported, checking for existing apps...');
    const existingApps = getApps();
    
    if (existingApps.length > 0) {
      console.log('[Firebase] Using existing Firebase app');
      auth = getAuth(existingApps[0]);
    } else {
      console.log('[Firebase] Initializing new Firebase app...');
      const app = initializeApp(firebaseConfig);
      console.log('[Firebase] Firebase app initialized successfully');
      auth = getAuth(app);
      console.log('[Firebase] Firebase Auth initialized successfully');
    }
    
    console.log('[Firebase] ✓ Firebase initialization complete');
  } catch (error) {
    console.error('[Firebase] ✗ Firebase initialization failed:', error);
    firebaseInitError = error as Error;
    auth = null;
  }

  return { auth, firebaseInitError };
};

export { auth, firebaseInitError };
