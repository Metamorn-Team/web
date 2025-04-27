import React from "react";

interface RetroInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  error?: boolean;
}

const RetroInput = ({
  value,
  onChange,
  placeholder,
  required,
  minLength,
  maxLength,
  error = false,
}: RetroInputProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      className={`w-full p-2 rounded-md outline-none transition
        ${error ? "border-red-500" : "border-[#bfae96]"}
        border bg-[#f9f5ec] shadow-[3px_3px_0_#8c7a5c] 
        focus:ring-2 focus:ring-[#e0d5c0] focus:border-[#a8987e]`}
    />
  );
};

export default RetroInput;
