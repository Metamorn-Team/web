import React from "react";

interface FullMessageModalProps {
  onClose: () => void;
  message: string;
}

const FullMessageModal = ({ onClose, message }: FullMessageModalProps) => {
  return (
    <div className="absolute bg-[#fff9ec] border-2 border-[#d6c6aa] rounded-xl p-4 shadow-lg w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-[#2a1f14] text-sm">
          전체 메시지 보기
        </span>
        <button
          onClick={onClose}
          className="text-[#2a1f14] hover:text-red-500 text-xs"
        >
          ✕
        </button>
      </div>
      <div className="text-sm text-[#2a1f14] whitespace-pre-wrap break-words h-64 overflow-y-auto border-t border-[#e0d8c6] pt-2">
        {message}
      </div>
    </div>
  );
};

export default FullMessageModal;
