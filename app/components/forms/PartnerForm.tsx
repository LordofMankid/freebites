import { createFeedback } from "@/lib/api/feedback";
import { emptyFeedback, FeedbackFormData } from "@/lib/util/types";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import FormInput from "../common/FormInput";
import { animate, createScope, createSpring, Scope } from "animejs";
import PageHeader from "../common/PageHeader";

export interface PartnerFormProps {
  className?: string;
}
const PartnerForm = (props: PartnerFormProps) => {
  const { className } = props;
  const scope = useRef<Scope | null>(null);
  const root = useRef(null);
  const [formData, setFormData] = useState<FeedbackFormData>(emptyFeedback);
  const [submitted, setSubmitted] = useState<boolean>(false);

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
    setSubmitted(true);
    await createFeedback(formData);
  };
  return (
    <div
      ref={root}
      className={`w-screen h-screen flex flex-col justify-start items-center ${className}`}
    >
      {!submitted ? (
        <div className="w-full flex flex-col gap-2 justify-center items-center">
          <div className="py-8">
            <PageHeader
              title="Let's work together"
              subtitle={
                <>
                  Got any questions or want to bring Freebites to your school?{" "}
                  <br />
                  Send a message and someone on our team will reach out :)
                </>
              }
            />
          </div>
          <FormInput
            title="Full name"
            placeholder="First and last"
            type="text"
            onChange={(n) => setFormData({ ...formData, name: n.target.value })}
          />
          <FormInput
            title="Email"
            placeholder="Email address"
            type="text"
            onChange={(n) =>
              setFormData({ ...formData, email: n.target.value })
            }
          />
          <FormInput
            title="Message"
            placeholder="Leave us a message"
            type="textarea"
            onChange={(n) =>
              setFormData({ ...formData, message: n.target.value })
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
            disabled={!formData.name || !formData.email || !formData.message}
          >
            Send Message
          </button>
          <p className="font-inter text-neutral-light-text">
            Already an ambassador?{" "}
            <Link href="/admin" className="underline">
              Manage your school here
            </Link>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-lg font-baloo font-semibold">
            Thanks for giving us feedback!
          </p>
          <Link
            className="rounded-full bg-orange-medium mt-2 px-10 py-2 text-white text-lg font-baloo font-semibold"
            href="/"
          >
            Back Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default PartnerForm;
