"use client";

import classNames from "classnames";

interface RadioButtonProps {
  label: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
  variant?: "card" | "default";
}

export default function RadioButton({
  label,
  icon,
  selected,
  onClick,
  className,
  variant = "default",
}: RadioButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "transition text-sm font-semibold flex items-center gap-2 px-2 py-1",
        variant === "card" &&
          classNames(
            "w-full justify-center rounded-md border",
            selected
              ? "bg-yellow-50 border-yellow-600 ring-2 ring-yellow-400 text-[#3d2c1b]"
              : "bg-white border-[#d6c6aa] text-[#5c4b32]"
          ),
        variant === "default" &&
          classNames(
            "rounded-md",
            selected ? "text-[#a27c3f]" : "text-[#5c4b32]"
          ),
        className
      )}
    >
      {variant === "default" && (
        <span
          className={classNames(
            "w-4 h-4 rounded-full border flex items-center justify-center transition",
            selected
              ? "bg-white border-[#a27c3f] shadow-inner"
              : "border-[#bbb] bg-white shadow-sm"
          )}
        >
          {selected && (
            <span className="w-2 h-2 bg-[#a27c3f] rounded-full shadow" />
          )}
        </span>
      )}
      {icon || label}
    </button>
  );
}
