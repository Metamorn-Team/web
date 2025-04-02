import React from "react";

interface TalkModalProps {
  children: React.ReactElement;
  onClose: () => void;
  className?: string;
  avatar: React.ReactNode;
}

const TalkModal = ({
  children,
  onClose,
  className,
  avatar,
}: TalkModalProps) => {
  return (
    <div className="fixed inset-0 flex items-end justify-center z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div
        className={`relative bg-paperSmall bg-cover p-12 z-10 animate-fadeIn rounded-3xl w-full ${className}`}
        style={{ aspectRatio: "3/1", maxWidth: 780 }}
      >
        <div className="absolute" style={{ top: -160, left: -50 }}>
          {avatar}
        </div>
        <p className="text-2xl mb-3">착한 토치 고블린</p>
        {children}
      </div>
    </div>
  );
};

export default TalkModal;
