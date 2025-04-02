import Image from "next/image";
import { FiUser } from "react-icons/fi";

interface MenuHeaderProps {
  isPlayBgm: boolean;
  playBgmToggle: () => void;
  changeFriendModalOpen: (state: boolean) => void;
}

export default function MenuHeader({
  isPlayBgm,
  playBgmToggle,
  changeFriendModalOpen,
}: MenuHeaderProps) {
  return (
    <header className="absolute flex justify-center items-center top-0 h-14 w-screen bg-white bg-opacity-40 z-40">
      <button
        className="round w-[fit-content] h-[fit-content] focus:outline-none z-50"
        onClick={playBgmToggle}
      >
        {isPlayBgm ? (
          <Image
            src={"/icons/none-mute-icon.svg"}
            width={64}
            height={64}
            alt="none-mute-icon"
          />
        ) : (
          <Image
            src={"/icons/mute-icon.svg"}
            width={64}
            height={64}
            alt="mute-icon"
          />
        )}
      </button>
      <button onClick={() => changeFriendModalOpen(true)}>
        <FiUser width={64} height={64} />
      </button>
    </header>
  );
}
