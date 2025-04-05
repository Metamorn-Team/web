import React, { useEffect } from "react";

interface ModalProps {
  children: React.ReactElement;
  onClose: () => void;
  className?: string;
}

export default function Modal({ children, onClose, className }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div
        className={`relative bg-paperLongBg bg-cover p-10 z-10 animate-fadeIn rounded-3xl ${className}`}
        style={{ aspectRatio: "1/1.3" }}
      >
        {children}
      </div>
    </div>
  );
}
