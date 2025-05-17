import { EventWrapper } from "@/game/event/EventBus";
import React, { useEffect, useState } from "react";

interface TalkModalProps {
  onClose: () => void;
  className?: string;
  name: string;
  avatar: React.ReactNode;
  comments: string[];
}

const TalkModal = ({
  onClose,
  className,
  name,
  avatar,
  comments,
}: TalkModalProps) => {
  const [index, setIndex] = useState(0);

  const onCompleteTalk = () => {
    EventWrapper.emitToGame("enableGameKeyboardInput");
    onClose();
  };

  const goNext = () => {
    if (index < comments.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      onCompleteTalk();
    }
  };

  const goPrev = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCompleteTalk();
      }

      if (e.code === "Space") {
        e.preventDefault();
        goNext();
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [index]);

  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-50"
      onClick={goNext}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCompleteTalk}
      ></div>

      <div
        className={`relative flex flex-col bg-paperBg bg-cover m-2 py-4 px-8 z-10 animate-fadeIn rounded-3xl w-full md:w-4/5 justify-between ${className}`}
        style={{ aspectRatio: "3/1", maxWidth: 780 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 아바타 */}
        <div className="absolute" style={{ top: -160, left: -50 }}>
          {avatar}
        </div>

        {/* 대사 내용 */}
        <div className="flex flex-col">
          <p className="text-xl sm:text-2xl mb-3">{name}</p>
          <p className="text-base sm:text-lg whitespace-pre-line">
            {comments[index]}
          </p>
        </div>

        {/* 인디케이터 + 유도 텍스트 */}
        <div className="flex justify-between items-center mt-4 w-full">
          {/* 이전 텍스트 버튼 */}
          <div
            onClick={goPrev}
            className={`animate-pulse text-sm text-gray-600 select-none ${
              index === 0
                ? "opacity-30 cursor-not-allowed"
                : "cursor-pointer hover:text-black"
            }`}
          >
            ◀ Prev
          </div>

          {/* 인디케이터 */}
          <div className="flex space-x-2">
            {comments.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === index ? "bg-gray-800" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* 다음 텍스트 버튼 */}
          <div
            onClick={goNext}
            className="animate-pulse text-sm text-gray-600 select-none cursor-pointer hover:text-black"
          >
            Space ▶
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalkModal;
