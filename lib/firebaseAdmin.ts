// lib/firebaseAdmin.ts
import * as admin from "firebase-admin";

// Extend global to include our Firebase app
declare global {
  var firebaseAdmin: admin.app.App | undefined;
}

// Use global variable to ensure single initialization across hot reloads
const getFirebaseAdmin = () => {
  // Client-side guard
  if (typeof window !== "undefined") {
    throw new Error("Firebase Admin SDK should only be used server-side");
  }

  // Return existing instance if available
  if (global.firebaseAdmin) {
    return global.firebaseAdmin;
  }

  // Initialize new instance
  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
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

// Initialize automatically when module is imported
const firebaseApp = getFirebaseAdmin();

// Export utilities that use the initialized app
export const verifyIdToken = async (token: string) => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    return await admin.auth(firebaseApp).verifyIdToken(token);
  } catch (error) {
    console.error("Token verification failed:", error);
    throw error;
  }
};

export const auth = admin.auth(firebaseApp);
export const firestore = admin.firestore(firebaseApp);

// Export the app instance if needed
export { firebaseApp };
