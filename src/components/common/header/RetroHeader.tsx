import React from "react";

interface RetroHeaderProps {
  leftItems: React.ReactNode;
  rightItems: React.ReactNode;
  className?: string;
}

export default function RetroHeader({
  leftItems,
  rightItems,
  className = "",
}: RetroHeaderProps) {
  return (
    <header
      className={`fixed top-0 left-0 w-full min-h-14 z-40 flex flex-wrap justify-between items-center px-4 sm:px-6 sm:py-3 bg-[#fdf8ef] border-b border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] ${className}`}
    >
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        {leftItems}
      </div>
      <div className="flex gap-2 sm:gap-3">{rightItems}</div>
    </header>
  );
}
