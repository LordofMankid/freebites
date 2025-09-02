/**
 * Firebase Admin SDK Initialization and Utilities
 *
 * This module initializes the Firebase Admin SDK and provides utility functions
 * to interact with Firebase services.
 *
 * Ensures a unique Firebase Admin SDK instance.
 *
 * We use the Firebase Admin SDK for more secure server-side authentication
 * which happens pre-render
 *
 * @module firebaseAdmin
 *
 * @example
 * // Example usage to verify an ID token
 * const decodedToken = await verifyIdToken(idToken);
 *
 * @example
 * // Example usage to get Firestore instance
 * const firestore = getFirestore();
 * const docRef = firestore.collection('users').doc(userId);
 */
import { UserSchemaDefinition, UserType } from "@freebites/freebites-types";
import admin from "firebase-admin";
import getAccountConnection from "./mongoAccounts";
import { UserRole } from "@freebites/freebites-types/dist/UserTypes";

// Extend global to include our Firebase app
declare global {
  var firebaseAdmin: admin.app.App | undefined;
}

// Initialize Firebase Admin
const initializeFirebaseAdmin = () => {
  // Client-side guard
  if (typeof window !== "undefined") {
    throw new Error("Firebase Admin SDK should only be used server-side");
  }

  // console.log("Initializing Firebase Admin SDK...");

  // Check if already initialized
  if (global.firebaseAdmin) {
    console.log("Firebase Admin SDK already initialized, reusing instance");
    return global.firebaseAdmin;
  }

  // Check for existing Firebase apps
  if (admin.apps.length > 0) {
    console.log("Firebase Admin already has apps, using first one");
    global.firebaseAdmin = admin.apps[0] as admin.app.App;
    return global.firebaseAdmin;
  }

  // Validate environment variables
  const requiredEnvVars = {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  };

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: requiredEnvVars.FIREBASE_PROJECT_ID!,
        clientEmail: requiredEnvVars.FIREBASE_CLIENT_EMAIL!,
        privateKey: requiredEnvVars.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
      storageBucket: requiredEnvVars.FIREBASE_STORAGE_BUCKET,
    });

    // Store in global for reuse
    global.firebaseAdmin = app;
    console.log("Firebase Admin SDK initialized successfully");
    return app;
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw error;
  }
};

// Get Firebase Admin instance
const getFirebaseAdmin = () => {
  if (!global.firebaseAdmin) {
    return initializeFirebaseAdmin();
  }
  return global.firebaseAdmin;
};

// Export utilities that use the initialized app
export const verifyIdToken = async (token: string) => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    // console.log("Verifying ID token...");
    const app = getFirebaseAdmin();
    const decodedToken = await admin.auth(app).verifyIdToken(token);

    const conn = await getAccountConnection();
    const UserModel =
      conn.models.User ||
      conn.model<UserType>("User", UserSchemaDefinition, "profiles");
    // add mongoDB verification here, throw error if not admin
    const user: UserType = await UserModel.findOne({
      uid: decodedToken.uid,
    }).exec();

    if (!user || user.role === UserRole.USER)
      throw new Error("user not found or not an admin");

    return decodedToken;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw error;
  }
};

// Export auth and firestore instances
export const getAuth = () => {
  const app = getFirebaseAdmin();
  return admin.auth(app);
};

export const getFirestore = () => {
  const app = getFirebaseAdmin();
  return admin.firestore(app);
};

// Export the app instance if needed
export const getFirebaseApp = () => {
  return getFirebaseAdmin();
};

export const getStorage = () => {
  const app = getFirebaseAdmin();
  return admin.storage(app);
};
