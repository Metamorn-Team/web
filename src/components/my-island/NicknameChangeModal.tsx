"use client";

import { useState } from "react";
import RetroModal from "@/components/common/RetroModal";
import RetroButton from "@/components/common/RetroButton";
import Alert from "@/utils/alert";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as PROFILE_QUERY_KEY } from "@/hook/queries/useGetMyProfile";
import { useChangeNickname } from "@/hook/queries/useChangeNickname";
import { removeItem } from "@/utils/persistence";
import { EventWrapper } from "@/game/event/EventBus";

interface NicknameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
}

export default function NicknameChangeModal({
  isOpen,
  onClose,
  currentName,
}: NicknameChangeModalProps) {
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState(currentName);
  const [error, setError] = useState("");

  const { mutate: changeName } = useChangeNickname(() => {
    Alert.done("이름이 변경되었어요!", false);
    queryClient.invalidateQueries({
      queryKey: [PROFILE_QUERY_KEY],
    });
    EventWrapper.emitToGame("changeNickname", nickname);
    removeItem("profile");
    onClose();
  });

  const handleSave = () => {
    if (nickname.length < 2 || nickname.length > 20) {
      setError("이름은 2~20자 사이여야 해요.");
      return;
    }
    setError("");
    changeName({ nickname });
  };

  return (
    <RetroModal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">📛 이름 변경</h2>

        <div>
          <div className="flex gap-2 items-center">
            <label className="block text-sm font-semibold mb-1">새 이름</label>
            <p className="text-xs text-gray-500 mb-1">2~20자까지 입력 가능</p>
          </div>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-3 py-2 border border-[#8c7a5c] rounded bg-[#fdf8ef] text-sm"
            placeholder="예: 리아최고"
          />
          {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex justify-end space-x-2">
          <RetroButton onClick={onClose} className="text-sm">
            취소
          </RetroButton>
          <RetroButton onClick={handleSave} className="text-sm">
            저장
          </RetroButton>
        </div>
      </div>
    </RetroModal>
  );
}
