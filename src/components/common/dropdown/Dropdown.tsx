import React, { useRef, useEffect } from "react";

interface DropdownProps {
  open: boolean;
  onClose: () => void;
  anchor: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Dropdown({
  open,
  onClose,
  anchor,
  children,
  className,
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  return (
    <div className="relative" ref={ref}>
      {anchor}
      {open && (
        <div
          className={`absolute right-0 top-full mt-2 z-50 ${className ?? ""}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
