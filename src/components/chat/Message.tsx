import Image from "next/image";
import React from "react";

interface MessageProps {
  isMine: boolean;
  avatarKey: string;
  sender: string;
  message: string;
}

const Message = ({ isMine, avatarKey, sender, message }: MessageProps) => {
  return (
    <div
      className={`flex gap-2 max-w-[80%] text-[#2a1f14] ${
        isMine ? "ml-auto flex-row-reverse" : ""
      }`}
    >
      <div className="relative w-8 h-8 flex-shrink-0">
        <Image
          src={`/images/avatar/${avatarKey}.png`}
          fill
          className={isMine ? "scale-x-[-1]" : ""}
          alt="avatar"
        />
      </div>
      <div
        className={`px-3 py-2 flex flex-col rounded-md ${
          isMine ? "bg-[#e8e0d0]" : "bg-[#f3ece1]"
        }`}
      >
        <div className="font-semibold opacity-80 text-right">{sender}</div>
        <div className="break-all whitespace-pre-wrap">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
