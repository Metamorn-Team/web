import { getRandomPawnColor } from "@/utils/random";
import Pawn from "./Pawn";

interface ErrorFallbackProps {
  message: string;
  size?: "s" | "m" | "l";
  onClick?: () => void;
  buttonText?: string;
  backgroundColor?: string;
  fullScreen?: boolean;
}

export default function ErrorFallback({
  message,
  size = "s",
  onClick,
  buttonText,
  backgroundColor = "bg-gray-200",
  fullScreen = true,
}: ErrorFallbackProps) {
  const sizeMap = {
    s: {
      pawn: "w-[60px] h-[60px]",
      font: "text-sm",
      left: "left-[10px]",
    },
    m: {
      pawn: "w-[80px] h-[80px]",
      font: "text-base",
      left: "left-[15px]",
    },
    l: {
      pawn: "w-[100px] h-[100px]",
      font: "text-lg",
      left: "left-[20px]",
    },
  };

  return (
    <div
      className={`${
        fullScreen ? "absolute inset-0" : ""
      } flex flex-col gap-2 items-center justify-center ${backgroundColor}`}
    >
      <div className="flex flex-col items-center text-gray-500 gap-2">
        <div className="relative">
          <Pawn
            color={getRandomPawnColor()}
            animation="run"
            className={sizeMap[size].pawn}
            paused
          />
          <div className={`absolute ${sizeMap[size].left} top-0 text-2xl`}>
            💧
          </div>
        </div>
        <div className={sizeMap[size].font}>{message}</div>
      </div>
      {buttonText && (
        <button
          onClick={onClick}
          className="text-blue-500 text-sm font-bold hover:underline"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
