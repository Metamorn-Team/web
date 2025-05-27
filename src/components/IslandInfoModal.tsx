"use client";

import Image from "next/image";
import { FaEdit, FaSave, FaUser } from "react-icons/fa";
import RetroModal from "@/components/common/RetroModal";
import { useIslandStore } from "@/stores/useIslandStore";
import { useGetIslandInfo } from "@/hook/queries/useGetIslandInfo";
import { useEffect, useState } from "react";
import { socketManager } from "@/game/managers/socket-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { UpdateIslandInfoRequest } from "mmorntype";
import Alert from "@/utils/alert";
import { getPresignedUrl, uploadImage } from "@/api/file";
import { BUCKET_PATH, CDN_URL } from "@/constants/image-path";
import { FiCamera } from "react-icons/fi";

type UpdateData = Required<{
  -readonly [k in keyof UpdateIslandInfoRequest]: UpdateIslandInfoRequest[k];
}>;

interface IslandInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IslandInfoModal({
  isOpen,
  onClose,
}: IslandInfoModalProps) {
  const currentIslandId = useIslandStore((state) => state.id);
  console.log("currentIslandId", currentIslandId);

  return (
    <RetroModal isOpen={isOpen} onClose={onClose} className="!max-w-xl">
      <div className="p-4 space-y-4">
        {currentIslandId ? (
          <NormalIslandInfo islandId={currentIslandId} />
        ) : (
          <DesertedIslandInfo />
        )}
      </div>
    </RetroModal>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-24 font-bold shrink-0 text-base">{label}:</span>
      <span className="flex-1 break-words text-base">{value}</span>
    </div>
  );
}

function NormalIslandInfo({ islandId }: { islandId: string }) {
  const { data: island, isLoading } = useGetIslandInfo(islandId);
  const [isEditing, setIsEditing] = useState(false);

  const [data, setData] = useState<UpdateData>({
    id: islandId,
    name: "",
    description: "",
    coverImage: "",
    maxMembers: 4,
  });

  const onChange = <K extends keyof UpdateData>(
    key: K,
    value: UpdateData[K]
  ) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
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

  const validateFields = () => {
    const errors = {
      name: "",
      description: "",
    };

    if (data.name.length < 1 || data.name.length > 50) {
      errors.name = "이름은 1자 이상 50자 이하로 입력해주세요";
    }

    if (data.description.length < 1 || data.description.length > 200) {
      errors.description = "설명은 1자 이상 200자 이하로 입력해주세요";
    }

    return errors;
  };

  const edit = () => {
    if (!island) return;

    const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);
    if (!socket) return;

    const { data, hasChanged } = validateUpdatedIslandData();
    console.log("validateUpdatedIslandData", data, hasChanged);

    if (hasChanged) {
      socket.emit("updateIslandInfo", data);
    }
  };

  const validateUpdatedIslandData = () => {
    let hasChanged = false;

    if (
      data.name !== island?.name &&
      data.name?.length >= 1 &&
      data.name?.length <= 50
    ) {
      hasChanged = true;
    }

    if (
      data.description !== island?.description &&
      data.description?.length >= 1 &&
      data.description?.length <= 200
    ) {
      hasChanged = true;
    }

    if (data.coverImage !== island?.coverImage) {
      const isUrlValid = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(
        data.coverImage
      );

      const includesCdnUrl = data.coverImage.includes(CDN_URL);

      if (isUrlValid && includesCdnUrl) {
        hasChanged = true;
      }
    }

    if (
      data.maxMembers !== island?.maxMembers &&
      [1, 2, 3, 4, 5].includes(data.maxMembers)
    ) {
      hasChanged = true;
    }

    // (커버 이미지 변경 UI가 생기면 비교 대상 추가해서 여기에 포함)

    return { data, hasChanged };
  };

  useEffect(() => {
    if (island) {
      setData({
        id: island.id,
        name: island.name,
        description: island.description,
        coverImage: island.coverImage,
        maxMembers: island.maxMembers,
      });
    }
  }, [island]);

  console.log("island", island);

  if (isLoading) return <div className="text-[#3d2c1b]">로딩 중...</div>;
  if (!island)
    return <div className="text-[#3d2c1b]">무언가 잘못된 섬이에요..</div>;

  const isOwner = true; // TODO: 실제 유저 정보와 비교하여 섬 주인 여부 결정

  const handleSave = () => {
    const errors = validateFields();

    if (errors.name || errors.description) {
      const errorMessages = [];
      if (errors.name) errorMessages.push(errors.name);
      if (errors.description) errorMessages.push(errors.description);

      Alert.warn(errorMessages.join("\n"));
      return;
    }

    edit();
    setIsEditing(false);
  };

  return (
    <div className="text-[#3d2c1b] space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🏝️ 참여 중인 섬 정보
        </h2>
        {isOwner && (
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="flex items-center gap-1 text-xs bg-[#e8e0d0] border border-[#c4b89c] px-2 py-1 rounded text-[#5c4b32]"
          >
            {isEditing ? <FaSave /> : <FaEdit />}
            {isEditing ? "저장" : "수정"}
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <div className="relative mt-4 flex justify-center items-center max-w-[330px] w-2/3 aspect-[4/3] border border-[#8c7a5c] rounded-lg overflow-hidden mb-4">
          <Image
            src={isEditing ? data.coverImage : island.coverImage}
            alt="섬 이미지"
            width={800}
            height={160}
            className="w-full h-full object-cover"
          />

          {isEditing && (
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer transition-opacity hover:bg-opacity-40 group">
              <FiCamera className="text-white text-2xl opacity-70 group-hover:scale-110 transition-transform" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="text-sm space-y-2">
        <InfoRow
          label="이름"
          value={
            isEditing ? (
              <input
                className="border border-[#c4b89c] rounded px-2 py-1 text-sm w-full"
                value={data.name}
                onChange={(e) => onChange("name", e.target.value)}
              />
            ) : (
              island.name
            )
          }
        />
        <InfoRow
          label="최대 인원"
          value={
            isEditing ? (
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => onChange("maxMembers", n)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${
                      data.maxMembers === n
                        ? "bg-[#a18d6f] text-white border-[#5c4b32]"
                        : "bg-[#e8e0d0] text-[#5c4b32] border-[#c4b89c]"
                    }`}
                  >
                    {n}명
                  </button>
                ))}
              </div>
            ) : (
              `${island.maxMembers}명`
            )
          }
        />

        <InfoRow
          label="설명"
          value={
            isEditing ? (
              <textarea
                className="border border-[#c4b89c] rounded px-2 py-1 text-sm w-full h-20"
                value={data.description}
                onChange={(e) => onChange("description", e.target.value)}
              />
            ) : (
              island.description
            )
          }
        />
        <InfoRow
          label="섬 주인"
          value={
            <span className="flex items-center gap-1">
              <FaUser /> {island.owner.nickname}
            </span>
          }
        />
        <InfoRow
          label="태그"
          value={
            <div className="flex flex-wrap gap-2">
              {island.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-[#e8e0d0] text-[#5c4b32] text-xs rounded-full border border-[#c4b89c]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
}

function DesertedIslandInfo() {
  return (
    <div className="text-[#3d2c1b] space-y-4 text-sm">
      <h2 className="text-xl font-bold flex items-center gap-2">
        🏝️ 무인도에 오신 것을 환영합니다
      </h2>
      <p>이곳은 주인 없는 무인도예요</p>
      <p>언제, 누구라도 이곳에 닿을 수 있어요</p>
      <p>고요한 시간을 보내며 누군가 찾아오길 기다려보아요 🌊</p>
    </div>
  );
}
