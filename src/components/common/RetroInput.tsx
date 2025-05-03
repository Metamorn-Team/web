import classNames from "classnames";
import React from "react";

interface RetroInputProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  error?: boolean;
  className?: string;
}

const RetroInput = ({
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  minLength,
  maxLength,
  error = false,
  className,
}: RetroInputProps) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      className={classNames(
        `w-full p-2 rounded-md outline-none transition
        ${error ? "border-red-500" : "border-[#bfae96]"}
        border bg-[#f9f5ec] shadow-[3px_3px_0_#8c7a5c] 
        focus:ring-2 focus:ring-[#e0d5c0] focus:border-[#a8987e]`,
        className
      )}
    />
  );
};

export default RetroInput;
