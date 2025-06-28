"use client";
import { createFeedback } from "@/lib/api/feedback";
import { emptyFeedback, FeedbackFormData } from "@/lib/util/types";
import Link from "next/link";
import React, { useState } from "react";

const EmailForm = () => {
  const [formData, setFormData] = useState<FeedbackFormData>(emptyFeedback);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async () => {
    setSubmitted(true);
    const res = await createFeedback(formData);
    console.log("response: ", res);
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      {!submitted ? (
        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-lg font-baloo font-semibold">Name</p>
          <input
            className="w-80 border-1 rounded-lg border-black p-2"
            type="text"
            id="name"
            name="name"
            onChange={(n) => setFormData({ ...formData, name: n.target.value })}
          />
          <p className="text-lg font-baloo font-semibold">School</p>
          <input
            className="w-80 border-1 rounded-lg border-black p-2"
            type="text"
            id="school"
            name="school"
            onChange={(s) =>
              setFormData({ ...formData, school: s.target.value })
            }
          />
          <p className="text-lg font-baloo font-semibold">Note</p>
          <textarea
            className="w-80 h-24 border-1 rounded-lg border-black p-2"
            id="note"
            name="note"
            onChange={(n) => setFormData({ ...formData, note: n.target.value })}
          />
          <button
            className="rounded-full bg-orange-medium mt-2 px-10 py-2 text-white text-lg font-baloo font-semibold"
            onClick={handleSubmit}
          >
            Submit
          </button>
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

export default EmailForm;
