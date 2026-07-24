"use client";
import { auth } from "@/configs/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import React from "react";

function Authentication({ children }: any) {
  const provider = new GoogleAuthProvider();
  const router = useRouter();

  const onButtonPress = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const idToken = await user.getIdToken();

      document.cookie = `firebase_token=${idToken}; path=/`;

      toast.success(`Welcome back, ${user.displayName}! 👋`);

      router.replace("/app");
    } catch (error: any) {
      console.error(error);

      toast.error(error?.message || "Failed to sign in. Please try again.");
    }
  };
  return (
    <div>
      <div onClick={onButtonPress}>{children}</div>
    </div>
  );
}

export default Authentication;
