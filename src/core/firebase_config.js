/**
 * Cortex Optional Firebase Web Configuration
 * -------------------------------------------------------------------------
 * Leave null to keep Cortex 100% local-only by default (users can still
 * paste their own Firebase Web Config inside Auth Vault -> Cloud Sync).
 *
 * To enable 1-click Google Sign-In & Firestore Sync across all your devices
 * automatically on ai.ambulkar.com, paste your Firebase Console Web App
 * config object below (Firebase web configs are public by design; data
 * security is enforced server-side via Firestore Security Rules).
 *
 * Example:
 * window.CORTEX_FIREBASE_CONFIG = {
 *   apiKey: "AIzaSy...",
 *   authDomain: "your-project.firebaseapp.com",
 *   projectId: "your-project",
 *   storageBucket: "your-project.firebasestorage.app",
 *   messagingSenderId: "1234567890",
 *   appId: "1:1234567890:web:abcdef123456"
 * };
 */
window.CORTEX_FIREBASE_CONFIG = window.CORTEX_FIREBASE_CONFIG || null;
