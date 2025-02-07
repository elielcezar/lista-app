import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import serviceAccount from './serviceAccount.json' assert { type: "json" };

const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "ecwd-e53bb.appspot.com"
});

export const storage = getStorage(app);