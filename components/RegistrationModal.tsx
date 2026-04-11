import React, { useState } from "react";
import {
  X,
  ArrowLeft,
  User as UserIcon,
  Briefcase,
} from "lucide-react";
import { UserType } from "../types";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

interface RegistrationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Auth data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Profile data
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<UserType>(UserType.STANDARD);

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ============================
     STEP 1 — ACCOUNT CREATION
  ============================= */
  const goToProfileStep = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setStep(2);
  };

  /* ============================
     FINAL SUBMIT
  ============================= */
  const handleRegister = async () => {
    if (!name) {
      setError("Name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1️⃣ Create user in Firebase Auth
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = result.user;

      // 2️⃣ Save profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name,
        type: userType,
        provider: "email",
        createdAt: new Date(),
      });

      // 3️⃣ Notify app
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-paper flex flex-col">
      {/* Header */}
      <div className="px-8 pt-16 pb-4 flex justify-end">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 flex justify-center">
        <div className="w-full max-w-md space-y-8">

          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold text-center">
                Create Account
              </h1>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border"
              />

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={goToProfileStep}
                className="w-full py-5 bg-primary text-white rounded-3xl"
              >
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-2xl font-bold text-center">
                Complete Profile
              </h1>

              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setUserType(UserType.STANDARD)}
                  className={`flex-1 py-4 rounded-xl ${
                    userType === UserType.STANDARD
                      ? "bg-primary text-white"
                      : "border"
                  }`}
                >
                  <UserIcon size={16} /> Person
                </button>

                <button
                  onClick={() => setUserType(UserType.BUSINESS)}
                  className={`flex-1 py-4 rounded-xl ${
                    userType === UserType.BUSINESS
                      ? "bg-primary text-white"
                      : "border"
                  }`}
                >
                  <Briefcase size={16} /> Business
                </button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-5 bg-primary text-white rounded-3xl"
              >
                {loading ? "Creating..." : "Create Horizon ID"}
              </button>

              <button
                onClick={() => setStep(1)}
                className="flex items-center justify-center gap-2 text-sm text-gray-400"
              >
                <ArrowLeft size={14} /> Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;