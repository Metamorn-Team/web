"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: "left" | "right";
  className?: string;
}

export default function Toggle({
  checked,
  onChange,
  label,
  labelPosition = "right",
  className = "",
}: ToggleProps) {
  return (
    <div
      className={`flex items-center gap-2 ${
        labelPosition === "left" ? "" : "flex-row-reverse"
      } ${className}`}
    >
      {label && (
        <span
          className={`text-xs ${
            checked ? "text-emerald-600" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {label}
        </span>
      )}

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
          checked
            ? "bg-emerald-500 dark:bg-emerald-400"
            : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
