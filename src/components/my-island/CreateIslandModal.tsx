"use client";

import { useState } from "react";
import GlassModal from "@/components/common/GlassModal";
import GlassButton from "@/components/common/GlassButton";
import Alert from "@/utils/alert";
import { useQueryClient } from "@tanstack/react-query";
import { useCreatePrivateIsland } from "@/hook/queries/useCreatePrivateIsland";
import { QUERY_KEY as PRIVATE_ISLANDS_QUERY_KEY } from "@/hook/queries/useGetPaginatedPrivateIsland";

interface CreateIslandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateIslandModal({
  isOpen,
  onClose,
}: CreateIslandModalProps) {
  const queryClient = useQueryClient();
  const { mutate: createPrivateIsland } = useCreatePrivateIsland(() => {
    queryClient.invalidateQueries({
      queryKey: [PRIVATE_ISLANDS_QUERY_KEY],
    });
    Alert.done("섬이 성공적으로 생성되었습니다!");
    onClose();
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * 1. 생성
   * 2. 생성중 상태로 변경
   * 3. 생성 중이 false가 되면 닫기
   * 3. 실패하면 잠시후 다시 alert
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      Alert.error("섬 이름을 입력해주세요.");
      return;
    }

    if (!formData.description.trim()) {
      Alert.error("섬 설명을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    const requestData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      mapKey: "island",
      isPublic: false,
    };
    createPrivateIsland(requestData);

    setIsLoading(false);
    handleClose();
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: "",
        description: "",
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <GlassModal
      onClose={handleClose}
      variant="crystal"
      className="w-full max-w-md mx-auto p-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">🏝️ 새 섬 만들기</h2>
        <p className="text-gray-600">
          친구들과 함께할 새로운 섬을 만들어보세요!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 섬 이름 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            섬 이름 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="섬 이름을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={50}
            disabled={isLoading}
          />
        </div>

        {/* 섬 설명 */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
            섬 설명 *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="섬에 대한 설명을 입력하세요"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            maxLength={200}
            disabled={isLoading}
          />
        </div>

        {/* 버튼들 */}
        <div className="flex gap-3 pt-4">
          <GlassButton
            onClick={handleClose}
            variant="ghost"
            className="flex-1"
            disabled={isLoading}
          >
            취소
          </GlassButton>
          <GlassButton type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "생성 중..." : "섬 만들기"}
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
}
