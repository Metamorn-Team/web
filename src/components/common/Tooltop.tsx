"use client";

import React, { ReactNode, useState } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Tooltip({
  content,
  children,
  className = "",
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative flex items-center ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-white border border-gray-200 rounded-xl shadow-md text-xs text-gray-700 whitespace-nowrap z-10">
          {content}
          {/* 말풍선 꼬리 */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45"></div>
        </div>
      )}
    </div>
  );
}
