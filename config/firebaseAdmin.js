const admin = require("firebase-admin");

// Parse the service account key JSON stored in Render env variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
