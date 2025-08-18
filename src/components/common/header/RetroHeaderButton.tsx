import React from "react";

interface RetroHeaderButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export default function RetroHeaderButton({
  icon,
  label,
  onClick,
}: RetroHeaderButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 bg-[#f3ece1] border border-[#5c4b32] rounded-[4px] text-[#5c4b32] text-[10px] sm:text-xs shadow-[2px_2px_0_#5c4b32] hover:bg-[#e8e0d0] transition-all"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
