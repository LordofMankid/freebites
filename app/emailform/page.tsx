"use client";
import { createFeedback } from "@/lib/api/feedback";
import { emptyFeedback, FeedbackFormData } from "@/lib/util/types";
import React, { useState } from "react";

const EmailForm = () => {
  const [formData, setFormData] = useState<FeedbackFormData>(emptyFeedback);

  const handleSubmit = async () => {
    const res = await createFeedback(formData);
    console.log("response: ", res);
  };
  return (
    <div className="flex flex-col gap-2 w-40">
      <p>name</p>
      <input
        className="border-1 border-black"
        type="text"
        id="name"
        name="name"
        onChange={(n) => setFormData({ ...formData, name: n.target.value })}
      />
      <p>school</p>
      <input
        className="border-1 border-black"
        type="text"
        id="school"
        name="school"
        onChange={(s) => setFormData({ ...formData, school: s.target.value })}
      />
      <p>note</p>
      <input
        className="border-1 border-black"
        type="text"
        id="note"
        name="note"
        onChange={(n) => setFormData({ ...formData, note: n.target.value })}
      />
      <button
        className="border-1 border-black bg-orange-100"
        onClick={handleSubmit}
      >
        {" "}
        submit{" "}
      </button>
    </div>
  );
};

export default EmailForm;
