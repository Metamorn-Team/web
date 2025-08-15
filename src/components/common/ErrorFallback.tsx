import { getRandomPawnColor } from "@/utils/random";
import Pawn from "./Pawn";

interface ErrorFallbackProps {
  message: string;
  size?: "s" | "m" | "l";
  onClick?: () => void;
  buttonText?: string;
}

export default function ErrorFallback({
  message,
  size = "s",
  onClick,
  buttonText,
}: ErrorFallbackProps) {
  const sizeMap = {
    s: {
      pawn: "w-[60px] h-[60px]",
      font: "text-sm",
    },
    m: {
      pawn: "w-[80px] h-[80px]",
      font: "text-base",
    },
    l: {
      pawn: "w-[100px] h-[100px]",
      font: "text-lg",
    },
  };

  return (
    <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-gray-200">
      <div className="relative flex flex-col items-center text-gray-500 gap-2">
        <Pawn
          color={getRandomPawnColor()}
          animation="run"
          className={sizeMap[size].pawn}
          paused
        />
        <div className="absolute left-[50px] top-0 text-2xl">💧</div>
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
