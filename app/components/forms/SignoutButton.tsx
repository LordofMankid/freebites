"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
// import { useState } from "react";
import CommonButton from "../common/CommonButton";
import { auth } from "@/lib/firebaseClient";
import { clearAuthCookie } from "@/lib/util/backend";
import { FaArrowRightLong } from "react-icons/fa6";
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

  return (
    <CommonButton
      label={"Log out"}
      onClick={handleSignOut}
      altStyle="border-0 justify-end p-0"
      altTextStyle="font-inter text-neutral-light-text text-right"
      rightIcon={<FaArrowRightLong />}
    />
  );
};

export default SignoutButton;
