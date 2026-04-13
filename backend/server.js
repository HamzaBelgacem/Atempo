const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const auth = admin.auth();
const db = admin.firestore();

/**
 * ✅ Middleware: Verify Firebase token
 */
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing auth token" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // uid, email, etc.
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ API is running with Firebase Auth");
});

// ✅ Protected route example
app.get("/api/me", verifyFirebaseToken, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.json({
      uid: req.user.uid,
      email: req.user.email,
      ...userDoc.data(),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
});

// ✅ Example protected action
app.post("/api/protected-action", verifyFirebaseToken, (req, res) => {
  res.json({
    message: "✅ You are authenticated",
    uid: req.user.uid,
    email: req.user.email,
  });
});

// 🚀 Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
``