import React from "react";

interface FormInputProps {
  title: string;
  placeholder: string;
  type: React.HTMLInputTypeAttribute;
  onChange: (
    arg0:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}
const FormInput = (props: FormInputProps) => {
  const { title, placeholder, type, onChange } = props;
  return (
    <div className="w-2/3 max-w-xl flex flex-col gap-3">
      <p className="text-base sm:text-lg lg:text-xl font-inter font-bold text-start">
        {title}
      </p>
      {type == "textarea" ? (
        <textarea
          className="w-full h-[290px] border-1 rounded-2xl border-neutral-gray py-3 lg:py-4 px-6 lg:px-8 text-inter text-base md:text-lg placeholder:text-neutral-lighter-text"
          id={title}
          name={title}
          placeholder={placeholder}
          style={{ resize: "none" }}
          onChange={onChange}
        ></textarea>
      ) : (
        <input
          className="w-full border-1 rounded-2xl border-neutral-gray py-3 lg:py-4 px-6 lg:px-8 text-inter text-base md:text-lg placeholder:text-neutral-lighter-text"
          type={type}
          id={title}
          name={title}
          placeholder={placeholder}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default FormInput;
