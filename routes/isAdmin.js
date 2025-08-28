import express from "express";
import admin from "firebase-admin";
import cors from "cors";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors()); // allow frontend (Netlify) to call API
app.use(express.json());

// Middleware to verify Firebase ID token
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// Admin check route
app.get("/is-admin", authenticate, (req, res) => {
  const isAdmin = req.user.email === process.env.ADMIN_EMAIL;
  res.json({ isAdmin });
});

app.listen(5000, () => console.log("Server running"));
