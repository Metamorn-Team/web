import React from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import SquareModal from "@/components/common/SquareModal";
import { UserInfo } from "@/types/socket-io/response";

interface PlayerInfoModalProps {
  playerInfo: UserInfo;
  onClose: () => void;
  className?: string;
}

const PlayerInfoModal = ({
  onClose,
  playerInfo,
  className,
}: PlayerInfoModalProps) => {
  return (
    <SquareModal onClose={onClose} width={"30%"} className={`${className}`}>
      <div className="w-full h-full flex flex-col items-center justify-between py-6 px-2">
        <div className="flex flex-col items-center gap-4">
          <div>
            <Image
              src={"/images/avatar/purple_pawn_avatar.png"}
              width={64}
              height={64}
              alt="avatar"
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-base font-bold">{playerInfo.nickname}</div>
            <div className="text-sm text-gray-500">{playerInfo.id}</div>
          </div>
        </div>

        <Button
          color="yellow"
          onClick={() => {}}
          title="친구 요청"
          width={"40%"}
          fontSize={"text-sm"}
        />
      </div>
    </SquareModal>
  );
};

export default PlayerInfoModal;
