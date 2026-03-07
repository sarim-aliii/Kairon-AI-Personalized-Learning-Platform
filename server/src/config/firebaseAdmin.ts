import * as admin from 'firebase-admin';

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set. Please check your server/.env file.');
}

let serviceAccount: admin.ServiceAccount;

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (error: any) {
  console.error('Error parsing FIREBASE_SERVICE_ACCOUNT. Make sure it is a valid JSON string.', error.message);
  process.exit(1);
}

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.projectId, 
    });

    console.log('Firebase Admin SDK initialized successfully from environment variable.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

export const firebaseAdmin = admin;

// Example of a function to verify a Firebase ID token
export const verifyFirebaseIdToken = async (token: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    throw new Error('Invalid Firebase ID token');
  }
};