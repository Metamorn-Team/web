import { EventWrapper } from "@/game/event/EventBus";
import { FiSend } from "react-icons/fi";

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: (e?: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ChatInput({
  input,
  setInput,
  onSend,
  inputRef,
}: ChatInputProps) {
  const onFocus = () => EventWrapper.emitToGame("disableGameInput");

  const onBlur = () => EventWrapper.emitToGame("enableGameKeyboardInput");

  return (
    <div className="p-3 border-t border-[#d6c6aa] bg-[#f3ece1]/90 flex items-center gap-2">
      <input
        type="text"
        ref={inputRef}
        value={input}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend(e)}
        placeholder="메시지를 입력하세요..."
        className="flex-1 px-3 py-2 rounded-md border border-[#d6c6aa] bg-white text-[#2a1f14] text-sm outline-none focus:ring-2 focus:ring-[#d6c6aa]"
      />
      <button
        onClick={() => onSend()}
        className="text-[#2a1f14] hover:text-[#7c6f58] transition"
      >
        <FiSend size={18} />
      </button>
    </div>
  );
}
