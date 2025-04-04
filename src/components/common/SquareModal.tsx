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
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div
        className={`relative bg-modalBg bg-cover p-10 animate-fadeIn rounded-3xl ${className}`}
        style={{ aspectRatio: "1/1", width, height: "auto" }}
      >
        {children}
      </div>
    </div>
  );
};

export default SquareModal;
