"use client";

import React from "react";
import classNames from "classnames";

interface PixelBadgeProps {
  className?: string;
  children: React.ReactNode;
}

export default function PixelBadge({ className, children }: PixelBadgeProps) {
  return (
    <div
      className={classNames(
        "bg-[#fdf8ef] border border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] rounded-[8px] px-3 py-2 text-[#3d2c1b]",
        className
      )}
    >
      {children}
    </div>
  );
}





