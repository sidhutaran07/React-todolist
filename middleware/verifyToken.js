Hey what about this
// middleware/verifyToken.js
const admin = require("firebase-admin");

// Make sure Firebase Admin is initialized once in your app
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), 
    // or use service account JSON: admin.credential.cert(require("./serviceAccountKey.json"))
  });
}

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and has the correct format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .send("Unauthorized: No token provided or malformed header.");
  }

  // Extract the token from the "Bearer <token>" string
  const idToken = authHeader.split("Bearer ")[1];

  try {
    // Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach user info to request
    req.user = decodedToken;

    // Continue to next middleware / route
    return next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).send("Unauthorized: Invalid token.");
  }
}

module.exports = verifyToken;
