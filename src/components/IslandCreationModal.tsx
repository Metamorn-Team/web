import React, { useState } from "react";
import RetroModal from "@/components/common/RetroModal";
import RetroButton from "@/components/common/RetroButton";
import RetroInput from "@/components/common/RetroInput";
import { socketManager } from "@/game/managers/socket-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";

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

export default function IslandCreationModal({
  isOpen,
  onClose,
}: IslandCreationModalProps) {
  // 상태 관리
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [testImage, setTestImage] = useState("");
  const [maxMembers, setMaxMembers] = useState<number>(5); // 초기값을 5로 설정
  // const [coverImage, setCoverImage] = useState<File | null>(null);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setCoverImage(file);
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // };

  const handleCreateIsland = () => {
    const islandData = {
      name,
      description,
      maxMembers,
      coverImage: testImage!,
    };

    const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);
    console.log(socket);
    socket?.emit("createIsland", islandData);
    // if (coverImage) {
    //   const islandData = {
    //     name,
    //     description,
    //     maxMembers,
    //     coverImage: imagePreview!,
    //   };
    //   onCreateIsland(islandData);
    //   onClose(); // 모달 닫기
    // } else {
    //   alert("커버 이미지를 선택해주세요.");
    // }
  };

  const handleMemberChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setMaxMembers(value);
    }
  };

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[500px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]"
    >
      <div className="flex flex-col gap-6 max-w-lg mx-auto">
        {/* 섬 생성 타이틀 */}
        <h3 className="text-3xl font-semibold text-[#2a1f14] text-center">
          🌴 새 섬 만들기
        </h3>

        {/* 섬 이름 */}
        <div>
          <label className="block text-sm font-medium text-[#5c4b32]">
            섬 이름
          </label>
          <RetroInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="섬의 이름을 입력하세요"
            className="mt-2 p-3 rounded-lg border border-[#8c7a5c] shadow-md focus:outline-none"
          />
        </div>

        {/* 섬 설명 */}
        <div>
          <label className="block text-sm font-medium text-[#5c4b32]">
            섬 설명
          </label>
          <RetroInput
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="섬에 대해 간단히 설명해주세요"
            className="mt-2 p-3 rounded-lg border border-[#8c7a5c] shadow-md focus:outline-none"
          />
        </div>

        {/* 최대 인원 버튼 */}
        <div>
          <label className="block text-sm font-medium text-[#5c4b32]">
            최대 인원
          </label>
          <div className="flex justify-center gap-4 mt-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <RetroButton
                key={value}
                onClick={() => handleMemberChange(value)}
                className={`w-10 p-2 text-lg rounded-lg ${
                  maxMembers === value
                    ? "bg-[#5c4b32] text-white"
                    : "bg-[#f3ece1] text-[#5c4b32]"
                }`}
              >
                {value}
              </RetroButton>
            ))}
          </div>
        </div>

        {/* 커버 이미지 */}
        {/* <div>
          <label className="block text-sm font-medium text-[#5c4b32]">
            섬의 커버 이미지
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="mt-2 p-2 border border-[#8c7a5c] rounded-lg cursor-pointer"
          />
          {imagePreview && (
            <div className="mt-4 flex justify-center">
              <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={120}
                className="rounded-lg shadow-md"
              />
            </div>
          )}
        </div> */}
        <div>
          <label className="block text-sm font-medium text-[#5c4b32]">
            이미지
          </label>
          <RetroInput
            value={testImage}
            onChange={(e) => setTestImage(e.target.value)}
            placeholder="섬에 대해 간단히 설명해주세요"
            className="mt-2 p-3 rounded-lg border border-[#8c7a5c] shadow-md focus:outline-none"
          />
        </div>

        {/* 생성 버튼 */}
        <div className="flex justify-center mt-6">
          <RetroButton
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
