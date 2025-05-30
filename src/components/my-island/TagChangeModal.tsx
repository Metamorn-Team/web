"use client";

import { useState } from "react";
import RetroModal from "@/components/common/RetroModal";
import RetroButton from "@/components/common/RetroButton";
import { useChangeTag } from "@/hook/queries/useChangeTag";
import Alert from "@/utils/alert";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as PROFILE_QUERY_KEY } from "@/hook/queries/useGetMyProfile";

interface TagChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTag: string;
}

export default function ChangeTagModal({
  isOpen,
  onClose,
  currentTag,
}: TagChangeModalProps) {
  const queryClient = useQueryClient();
  const [tag, setTag] = useState(currentTag);
  const [error, setError] = useState("");
  const { mutate: changeTag } = useChangeTag(() => {
    Alert.done("변경 완료!", false);
    queryClient.invalidateQueries({
      queryKey: [PROFILE_QUERY_KEY],
    });
    onClose();
  });

  const handleSave = () => {
    if (!/^[a-zA-Z0-9_]{4,15}$/.test(tag)) {
      setError("4~15자의 영문, 숫자, 밑줄(_)만 사용할 수 있어요.");
      return;
    }
    setError("");
    changeTag({ tag });
  };

  return (
    <RetroModal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">🔖 태그 변경</h2>

        <div>
          <div className="flex gap-2 items-center">
            <label className="block text-sm font-semibold mb-1">새 태그</label>
            <p className="text-xs text-gray-500 mb-1">
              영어 소문자와 밑줄(_)만 사용, 4~15자
            </p>
          </div>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full px-3 py-2 border border-[#8c7a5c] rounded bg-[#fdf8ef] text-sm"
            placeholder="예: i_love_livisland"
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
