"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
// import { useState } from "react";
import CommonButton from "../common/CommonButton";
import { auth } from "@/lib/firebaseClient";
import { clearAuthCookie } from "@/lib/util/backend";

const SignoutButton = () => {
  //   const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    // setLoading(true);
    try {
      await signOut(auth);
      await clearAuthCookie();
      router.push("/admin/login"); // Redirect
    } catch (err) {
      console.error("Sign-out failed", err);
    } finally {
      //   setLoading(false);
    }
  };

  return <CommonButton label={"Sign out"} onClick={handleSignOut} />;
};

export default SignoutButton;
