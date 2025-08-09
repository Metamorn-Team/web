"use client";

import React from "react";

interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export default function Label({
  htmlFor,
  children,
  required = false,
  className = "",
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block font-medium text-sm mb-1 ${className}`}
    >
      {children}
      {required && <span className="text-pink-500 ml-0.5">*</span>}
    </label>
  );
}
