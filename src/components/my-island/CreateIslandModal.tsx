"use client";

import { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import GlassModal from "@/components/common/GlassModal";
import GlassButton from "@/components/common/GlassButton";
import Alert from "@/utils/alert";
import { useQueryClient } from "@tanstack/react-query";
import { useCreatePrivateIsland } from "@/hook/queries/useCreatePrivateIsland";
import { QUERY_KEY as PRIVATE_ISLANDS_QUERY_KEY } from "@/hook/queries/useGetPaginatedPrivateIsland";
import ImageUploader from "@/components/common/ImageUploader";
import MapSelector from "@/components/MapSelector";
import Toggle from "@/components/common/Toggle";
import Tooltip from "@/components/common/Tooltop";
import Label from "@/components/common/Label";

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
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImage: "",
    mapKey: "island",
    isPublic: true,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      Alert.error("섬 이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    const requestData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      coverImage: formData.coverImage.trim(),
      mapKey: formData.mapKey.trim(),
      isPublic: formData.isPublic,
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
        coverImage: "",
        mapKey: "island",
        isPublic: true,
      });
      setStep(1);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <GlassModal
      onClose={handleClose}
      variant="crystal"
      opacity={0.8}
      className="w-full max-w-sm max-h-screen overflow-y-auto mx-auto p-4 rounded-2xl"
    >
      <div className="flex flex-col gap-2">
        {/* 헤더 (고정) */}
        <div className="text-center mb-3">
          <h2 className="text-xl font-bold mb-1">🏝️ 새 섬 만들기</h2>
          <p className="text-gray-500 text-sm">
            작고 귀여운 나만의 섬을 만들어보아요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          {step === 1 && (
            <>
              {/* 이미지 업로더 */}
              <div className="w-full flex justify-center">
                <ImageUploader
                  onChange={(url) =>
                    setFormData({ ...formData, coverImage: url })
                  }
                  value={formData.coverImage}
                  borderColor=""
                />
              </div>

              {/* 공개 여부 토글 */}
              <div className="flex items-center justify-between">
                <div />
                <div className="flex items-center gap-1">
                  <Tooltip
                    content="섬이 검색 가능하도록 할지 여부를 설정합니다"
                    position="left"
                  >
                    <div className="w-4 h-4 flex items-center justify-center text-gray-500">
                      <AiOutlineInfoCircle size={14} />
                    </div>
                  </Tooltip>
                  <Toggle
                    checked={formData.isPublic}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, isPublic: val }))
                    }
                    label={formData.isPublic ? "공개" : "비공개"}
                    labelPosition="left"
                  />
                </div>
              </div>

              {/* 섬 이름 */}
              <div>
                <Label htmlFor="name" required>
                  섬 이름
                </Label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="섬 이름을 입력해주세요"
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  maxLength={50}
                  disabled={isLoading}
                />
              </div>

              {/* 섬 설명 */}
              <div>
                <Label htmlFor="name">섬 설명</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="섬에 대해 설명해보아요"
                  rows={3}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
                  maxLength={200}
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <MapSelector
              selectedIslandKey={formData.mapKey}
              onSelect={(key) => setFormData({ ...formData, mapKey: key })}
              labelClassName="text-black"
              required
            />
          )}

          {/* 버튼 (고정) */}
          <div className="flex gap-2 pt-3">
            {step === 1 && (
              <>
                <GlassButton
                  onClick={handleClose}
                  variant="ghost"
                  className="flex-1 py-1.5 rounded-full text-sm"
                  disabled={isLoading}
                >
                  취소
                </GlassButton>
                <GlassButton
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-1.5 rounded-full text-sm bg-pink-400 hover:bg-pink-500"
                  disabled={isLoading}
                >
                  다음
                </GlassButton>
              </>
            )}

            {step === 2 && (
              <>
                <GlassButton
                  type="button"
                  onClick={() => setStep(1)}
                  variant="ghost"
                  className="flex-1 py-1.5 rounded-full text-sm"
                  disabled={isLoading}
                >
                  이전
                </GlassButton>
                <GlassButton
                  type="submit"
                  className="flex-1 py-1.5 rounded-full text-sm bg-pink-400 hover:bg-pink-500"
                  disabled={isLoading}
                >
                  {isLoading ? "생성 중..." : "만들기"}
                </GlassButton>
              </>
            )}
          </div>
        </form>
      </div>
    </GlassModal>
  );
}
