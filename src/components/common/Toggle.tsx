"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string; // 하나만 표시할 라벨
  labelPosition?: "left" | "right"; // 라벨 위치
  className?: string; // 추가 스타일
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
          className={`text-xs ${checked ? "text-pink-500" : "text-gray-500"}`}
        >
          {label}
        </span>
      )}

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? "bg-pink-300" : "bg-gray-300"
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
