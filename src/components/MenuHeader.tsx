import Image from "next/image";
import { FiUser } from "react-icons/fi";

interface MenuHeaderProps {
  isMute: boolean;
  muteToggle: () => void;
  changeFriendModalOpen: (state: boolean) => void;
}

export default function MenuHeader({
  isMute,
  muteToggle,
  changeFriendModalOpen,
}: MenuHeaderProps) {
  return (
    <header className="absolute flex justify-center items-center top-0 h-14 w-screen bg-white bg-opacity-40 z-40">
      <button
        className="round w-[fit-content] h-[fit-content] focus:outline-none z-50"
        onClick={muteToggle}
      >
        {isMute ? (
          <Image
            src={"/icons/mute-icon.svg"}
            width={64}
            height={64}
            alt="mute-icon"
          />
        ) : (
          <Image
            src={"/icons/none-mute-icon.svg"}
            width={64}
            height={64}
            alt="none-mute-icon"
          />
        )}
      </button>
      <button onClick={() => changeFriendModalOpen(true)}>
        <FiUser width={64} height={64} />
      </button>
    </header>
  );
}
