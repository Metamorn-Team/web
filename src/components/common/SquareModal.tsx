import React, { useEffect } from "react";

interface SquareModalProps {
  children: React.ReactElement;
  onClose: () => void;
  width: string;
  className?: string;
}

const SquareModal = ({
  children,
  onClose,
  width,
  className,
}: SquareModalProps) => {
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
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div
        className={`flex flex-col relative bg-modalBg bg-cover p-8 animate-fadeIn rounded-3xl min-w-[400px] ${className}`}
        style={{ aspectRatio: "1/1", width, height: "auto" }}
      >
        {children}
      </div>
    </div>
  );
};

export default SquareModal;
