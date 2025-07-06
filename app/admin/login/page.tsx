"use client";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import FormInput from "@/app/components/common/FormInput";
import { emptyLoginData, LoginData } from "@/lib/util/types";
import { animate, createScope, createSpring, Scope } from "animejs";
import Link from "next/link";
import PageHeader from "@/app/components/common/PageHeader";

export default function AdminLogin() {
  const scope = useRef<Scope | null>(null);
  const root = useRef(null);
  const [loginData, setLoginData] = useState<LoginData>(emptyLoginData);

  const handleMouseEnter = () => {
    animate("#submit", {
      scale: [
        { to: 1.05, ease: createSpring({ stiffness: 400 }), duration: 200 },
      ],
    });
  };

  const handleMouseExit = () => {
    animate("#submit", {
      scale: [{ to: 1, ease: createSpring({ stiffness: 500 }), duration: 400 }],
    });
  };

  useEffect(() => {
    scope.current = createScope({ root });
    return () => {
      if (scope.current) scope.current.revert();
    };
  }, []);
  const handleSubmit = async () => {
    // setSubmitted(true);
    // await createFeedback(formData);
  };
  return (
    <div ref={root}>
      <Navbar />
      {/* <div className="bg-orange-faint min-h-screen min-w-screen"> </div> */}
      <div className="w-full flex flex-col gap-2 justify-center items-center mt-12">
        <PageHeader
          title="Ambassador Login"
          subtitle={
            <>
              Access and manage you schools&apos; postings <br /> here with the
              information our team has given you.
            </>
          }
        />
        <FormInput
          title="Email"
          placeholder="Email address"
          type="text"
          onChange={(n) =>
            setLoginData({ ...loginData, email: n.target.value })
          }
        />
        <FormInput
          title="Password"
          placeholder="Password"
          type="password"
          onChange={(n) =>
            setLoginData({ ...loginData, password: n.target.value })
          }
        />
        <button
          id="submit"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseExit}
          className="z-30 w-2/3 max-w-xl rounded-full disabled:bg-neutral-disabled bg-orange-medium mt-8 px-10 py-2 md:py-3 lg:py-4 text-white disabled:text-neutral-text sm:text-lg md:text-xl font-inter font-semibold"
          onClick={() => {
            handleMouseExit();
            handleSubmit();
          }}
          disabled={!loginData.email || !loginData.password}
        >
          Login
        </button>
        <p className="text-neutral-text">
          Don&apos;t have an account?{" "}
          <Link href="/contact" className="underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
