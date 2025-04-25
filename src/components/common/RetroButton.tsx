"use client";

import React from "react";
import classNames from "classnames";

type RetroButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "ghost";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function RetroButton({
  children,
  onClick,
  className,
  variant = "primary",
  type = "button",
  disabled = false,
}: RetroButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "text-xs px-2 py-1 rounded border font-bold transition",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "shadow-[2px_2px_0_#5c4b32]",
        {
          "bg-[#bfae96] text-white border-[#5c4b32] hover:bg-[#a79b84]":
            variant === "primary",
          "bg-[#d4c8b0] text-[#2a1f14] border-[#5c4b32] hover:bg-[#c8baa1]":
            variant === "ghost",
        },
        className
      )}
    >
      {children}
    </button>
  );
}
