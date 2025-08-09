import { getRandomPawnColor } from "@/utils/random";
import Pawn from "./Pawn";

interface ErrorFallbackProps {
  message: string;
}

export default function ErrorFallback({ message }: ErrorFallbackProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
      <div className="relative flex flex-col items-center text-gray-500 gap-2">
        <Pawn
          color={getRandomPawnColor()}
          animation="run"
          className="w-[60px] h-[60px]"
          paused
        />
        <div className="absolute left-[50px] top-0 text-2xl">💧</div>
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
}
