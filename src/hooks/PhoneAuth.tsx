"use client";

import { useState, useEffect, useRef } from "react";
import { auth } from "../../lib/firebase/config";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  linkWithCredential,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

// Define the type for the hook's return value
type UsePhoneAuthReturnType = [
  sendVerificationCode: (
    phoneNumber: string,
    verificationCodeSentCallback: () => void,
    verificationCodeSentErrorCallback: () => void,
  ) => Promise<void>,
  verifyCode: (
    verificationCode: string,
    verificationCodeSuccessCallback: () => void,
    verificationCodeErrorCallback: () => void,
  ) => Promise<void>,
];

const usePhoneAuth = (
  recaptchaSolvedCallback: (response: string) => void,
): UsePhoneAuthReturnType => {
  const [verificationId, setVerificationId] = useState<string | null>(null);

  useEffect(() => {
    // Create the recaptcha container if it doesn't exist
    if (!document.getElementById("recaptcha-container")) {
      const container = document.createElement("div");
      container.id = "recaptcha-container";
      document.body.appendChild(container);

      // console.info('reCAPTCHA container created');
    }

    const cleanup = () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      // Remove the container on cleanup
      const container = document.getElementById("recaptcha-container");
      if (container) {
        container.remove();
      }
    };

    const initRecaptcha = () => {
      // cleanup();
      try {
        const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: (response: any) => {
            console.log("reCAPTCHA solved", response);
            recaptchaSolvedCallback(response);
          },
          "expired-callback": () => {
            cleanup();
          },
        });
        window.recaptchaVerifier = verifier;
        verifier.render().catch((error) => {
          console.error("Error rendering reCAPTCHA:", error);
        });
        // console.info('reCAPTCHA initialized');
      } catch (error) {
        console.error("reCAPTCHA initialization error:", error);
      }
    };

    // Initialize after ensuring container exists
    setTimeout(initRecaptcha, 0);

    // Set persistence and auth state listener
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log("Persistence set to local storage"))
      .catch((error) => console.error("Error setting persistence:", error));

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // console.log('User is signed in:', currentUser);
      } else {
        // console.log('No user is signed in');
      }
    });

    return () => {
      cleanup();
      unsubscribe();
    };
  }, []);

  const sendVerificationCode = async (
    phoneNumber: string,
    verificationCodeSentCallback: () => void,
    verificationCodeSentErrorCallback: () => void,
  ) => {
    // setError(null);

    if (!phoneNumber) {
      // setError('Please enter a phone number');
      return;
    }

    try {
      if (!window.recaptchaVerifier) {
        throw new Error("reCAPTCHA not initialized");
      }

      const formattedPhoneNumber = `+91${phoneNumber}`;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        window.recaptchaVerifier,
      );

      window.confirmationResult = confirmationResult;
      setVerificationId(confirmationResult.verificationId);
      verificationCodeSentCallback();
      console.log("Verification code sent");
    } catch (error: any) {
      console.error("Send code error:", error);
      // setError(error.message || 'Failed to send verification code');

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      verificationCodeSentErrorCallback();
    }
  };

  const verifyCode = async (
    verificationCode: string,
    verificationCodeSuccessCallback: () => void,
    verificationCodeErrorCallback: (error: string) => void,
  ) => {
    if (!verificationCode) {
      verificationCodeErrorCallback("Please enter the verification code");
      return;
    }

    if (!verificationId) {
      verificationCodeErrorCallback("No verification ID found");
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode,
      );
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          await linkWithCredential(currentUser, credential);
          console.log("Phone number linked to the existing user");
        } catch (linkError: any) {
          // If provider is already linked, try signing in instead
          if (linkError.code === "auth/provider-already-linked") {
            await signInWithCredential(auth, credential);
            console.log("User signed in with existing phone number");
          } else {
            throw linkError; // Re-throw other errors
          }
        }
      } else {
        await signInWithCredential(auth, credential);
        console.log("Phone number verified and user signed in");
      }

      verificationCodeSuccessCallback();
    } catch (error: any) {
      console.error("Verification error:", error);

      let errorMessage = "Failed to verify code";

      // Handle specific error cases
      switch (error.code) {
        case "auth/invalid-verification-code":
          errorMessage = "Invalid verification code. Please try again.";
          break;
        case "auth/code-expired":
          errorMessage =
            "Verification code has expired. Please request a new code.";
          break;
        case "auth/provider-already-linked":
          errorMessage = "This phone number is already linked to an account.";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid credentials. Please try again.";
          break;
        default:
          errorMessage = error.message || "An unexpected error occurred";
      }

      verificationCodeErrorCallback(errorMessage);
    }
  };

  return [sendVerificationCode, verifyCode];
};

export default usePhoneAuth;
