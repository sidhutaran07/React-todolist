const admin = require("firebase-admin");

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  if (serviceAccount.private_key) {
    // Fix escaped newlines
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} catch (err) {
  console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", err);
  throw new Error("Invalid service account key in environment variables");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
