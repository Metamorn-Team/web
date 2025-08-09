"use client";

import React, { ReactNode, useState } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  position?: "top" | "bottom" | "left" | "right"; // 위치 추가
}

export default function Tooltip({
  content,
  children,
  className = "",
  position = "top",
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 위치별 스타일 매핑
  const positionClasses: Record<
    typeof position,
    { container: string; arrow: string }
  > = {
    top: {
      container: "bottom-full mb-2 left-1/2 -translate-x-1/2",
      arrow: "top-full left-1/2 -translate-x-1/2 border-r border-b",
    },
    bottom: {
      container: "top-full mt-2 left-1/2 -translate-x-1/2",
      arrow: "bottom-full left-1/2 -translate-x-1/2 border-l border-t",
    },
    left: {
      container: "right-full mr-2 top-1/2 -translate-y-1/2",
      arrow: "left-full top-1/2 -translate-y-1/2 border-t border-r",
    },
    right: {
      container: "left-full ml-2 top-1/2 -translate-y-1/2",
      arrow: "right-full top-1/2 -translate-y-1/2 border-b border-l",
    },
  };

  return (
    <div
      className={`relative flex items-center ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && (
        <div
          className={`absolute ${positionClasses[position].container} px-2 py-1 bg-white border border-gray-200 rounded-xl shadow-md text-xs text-gray-700 whitespace-nowrap z-10`}
        >
          {content}
          {/* 말풍선 꼬리 */}
          <div
            className={`absolute w-2 h-2 bg-white border-gray-200 rotate-45 ${positionClasses[position].arrow}`}
          ></div>
        </div>
      )}
    </div>
  );
}
