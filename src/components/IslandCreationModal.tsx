import React, { useRef, useState } from "react";
import Image from "next/image";
import { CreateIslandRequest } from "mmorntype";
import RetroModal from "@/components/common/RetroModal";
import RetroButton from "@/components/common/RetroButton";
import RetroInput from "@/components/common/RetroInput";
import { socketManager } from "@/game/managers/socket-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { getPresignedUrl, uploadImage } from "@/api/file";
import { BUCKET_PATH, CDN_URL } from "@/constants/image-path";
import Alert from "@/utils/alert";

interface IslandCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateIsland: (islandData: {
    name: string;
    description: string;
    maxMembers: number;
    coverImage: string;
  }) => void;
}

const initial = {
  coverImage: "",
  description: "",
  name: "",
  maxMembers: 5,
};

export default function IslandCreationModal({
  isOpen,
  onClose,
}: IslandCreationModalProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [createData, setCreateData] = useState<CreateIslandRequest>(initial);

  const onChange = <K extends keyof CreateIslandRequest>(
    key: K,
    value: CreateIslandRequest[K]
  ) => {
    setCreateData({
      ...createData,
      [key]: value,
    });
  };

  const onClear = () => {
    setCreateData(initial);
  };

  const validateData = (data: Partial<CreateIslandRequest>) => {
    const { coverImage, description, maxMembers, name } = data;

    if (!coverImage || !description || !maxMembers || !name) {
      return false;
    }

    const urlReg = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

    return (
      name.length > 1 &&
      description.length > 1 &&
      urlReg.test(coverImage) &&
      maxMembers > 1 &&
      maxMembers <= 5
    );
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];

      const data = await getPresignedUrl({ path: BUCKET_PATH.ISLAND });
      const { presignedUrl, key } = data;

      if (!file) {
        Alert.error("이미지 업로드에 실패했어요..");
        return;
      }

      await uploadImage(presignedUrl, file);

      onChange("coverImage", `${CDN_URL}/${key}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      Alert.error("이미지 업로드에 실패했어요..");
      return;
    }
  };

  const handleCreateIsland = () => {
    validateData(createData);

    const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);
    console.log(socket);
    socket?.emit("createIsland", createData);
  };

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={() => {
        onClear();
        onClose();
      }}
      className="max-w-[400px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]"
    >
      <div className="flex flex-col gap-6 max-w-lg mx-auto">
        {/* 섬 생성 타이틀 */}
        <h3 className="text-3xl font-semibold text-[#2a1f14] text-center">
          🌴 새 섬 만들기
        </h3>
        {/* 커버 이미지 */}
        <div className="flex justify-center">
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div
            className="relative mt-4 flex justify-center items-center w-2/3 aspect-[4/3] border border-[#8c7a5c] rounded-lg"
            onClick={() => imageInputRef.current?.click()}
          >
            {createData.coverImage ? (
              <Image
                src={createData.coverImage}
                alt="Preview"
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-md"
              />
            ) : (
              <div className="flex flex-col items-center">
                <p>이미지를 등록해봐요!</p>
                <p>Click!</p>
              </div>
            )}
          </div>
        </div>

        {/* 섬 이름 */}
        <div>
          <label className="block text-sm font-medium text-[#5c4b32]">
            섬 이름
          </label>
          <RetroInput
            value={createData.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="섬의 이름을 입력하세요"
            className="mt-2 p-3 rounded-lg border border-[#8c7a5c] shadow-md focus:outline-none"
          />
        </div>

        {/* 최대 인원 버튼 */}
        <div>
          <label className="block text-sm font-medium text-[#5c4b32]">
            최대 인원
          </label>
          <div className="flex justify-center gap-4 mt-2">
            {[2, 3, 4, 5].map((value) => (
              <RetroButton
                key={value}
                onClick={() => onChange("maxMembers", value)}
                className={`w-10 p-2 text-lg rounded-lg ${
                  createData.maxMembers === value
                    ? "bg-[#5c4b32] text-white"
                    : "bg-[#f3ece1] text-[#5c4b32]"
                }`}
              >
                {value}
              </RetroButton>
            ))}
          </div>
        </div>

        {/* 섬 설명 */}
        <div>
          <label className="block text-sm font-medium text-[#5c4b32]">
            섬 설명
          </label>
          <RetroInput
            value={createData.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="섬에 대해 간단히 설명해주세요"
            className="mt-2 p-3 rounded-lg border border-[#8c7a5c] shadow-md focus:outline-none"
          />
        </div>

        {/* 생성 버튼 */}
        <div className="flex justify-center mt-6">
          <RetroButton
            disabled={!validateData(createData)}
            onClick={handleCreateIsland}
            className="w-36 bg-[#5c4b32] text-white rounded-lg py-2 px-4 hover:bg-[#4b3a27]"
          >
            섬 생성
          </RetroButton>
        </div>
      </div>
    </RetroModal>
  );
}
