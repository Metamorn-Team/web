"use client";

import React from "react";
import classNames from "classnames";

interface RetroSelectProps {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function RetroSelect({
  label,
  value,
  options,
  onChange,
  className,
  disabled = false,
}: RetroSelectProps) {
  return (
    <div className={classNames("flex flex-col gap-1", className)}>
      {label && (
        <span className="text-sm font-bold text-[#5c4b36]">{label}</span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          px-3 py-2 text-sm rounded-md 
          border-2 border-[#bfae96] bg-[#fdf8ef]
          shadow-[3px_3px_0_#8c7a5c] 
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-[4px_4px_0_#8c7a5c] transition"
          }
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
