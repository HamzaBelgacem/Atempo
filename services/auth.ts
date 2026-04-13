import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

// Register user
export const registerWithEmail = async (
  email: string,
  password: string
) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = result.user;

  // Save user profile in Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    provider: "email",
    createdAt: serverTimestamp(),
  });

  return user;
};

// Login user
export const loginWithEmail = async (
  email: string,
  password: string
) => {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
};

// ✅ Logout
export const logout = async () => {
  await signOut(auth);
};