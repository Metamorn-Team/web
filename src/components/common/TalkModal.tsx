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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCompleteTalk();
      }
      if (e.code === "Space") {
        e.preventDefault();

        if (index < comments.length - 1) {
          setIndex(index + 1);
        } else {
          onCompleteTalk();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [index]);

  return (
    <div className="fixed inset-0 flex items-end justify-center z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCompleteTalk}
      ></div>

      <div
        className={`relative flex flex-col bg-paperSmall bg-cover p-12 z-10 animate-fadeIn rounded-3xl w-full justify-between ${className}`}
        style={{ aspectRatio: "3/1", maxWidth: 780 }}
      >
        <div className="absolute" style={{ top: -160, left: -50 }}>
          {avatar}
        </div>
        <div className="flex flex-col">
          <p className="text-2xl mb-3">{name}</p>
          <p className="text-lg">{comments[index]}</p>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {comments.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === index ? "bg-gray-800" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TalkModal;
