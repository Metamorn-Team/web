import React, { useRef, useState } from "react";
import Image from "next/image";
import { getPresignedUrl, uploadImage } from "@/api/file";
import { BUCKET_PATH, CDN_URL } from "@/constants/image-path";
import Alert from "@/utils/alert";
import Pawn from "./Pawn";
import { getRandomPawnColor } from "@/utils/random";
import { DotLoader } from "./DotLoader";

const pawnColor = getRandomPawnColor();

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  bucketPath?: string;
  aspectRatio?: string;
  maxWidth?: string;
  borderColor?: string;
}

function ImageUploader({
  value,
  onChange,
  bucketPath = BUCKET_PATH.ISLAND,
  aspectRatio = "aspect-[4/3]",
  maxWidth = "max-w-[330px]",
  borderColor = "#8c7a5c",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false); // 🆕 업로드 상태

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) {
        Alert.error("이미지 업로드에 실패했어요..");
        return;
      }

      setIsUploading(true); // 🆕 업로드 시작
      const { presignedUrl, key } = await getPresignedUrl({ path: bucketPath });
      await uploadImage(presignedUrl, file);
      onChange(`${CDN_URL}/${key}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      Alert.error("이미지 업로드에 실패했어요..");
    } finally {
      setIsUploading(false); // 🆕 업로드 종료
    }
  };

  return (
    <div
      className={`relative mt-4 flex justify-center items-center ${maxWidth} w-2/3 ${aspectRatio} border border-[${borderColor}] rounded-lg cursor-pointer overflow-hidden`}
      onClick={() => !isUploading && inputRef.current?.click()} // 🆕 업로드 중에는 클릭 방지
    >
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {isUploading ? ( // 🆕 업로드 중 로더 표시
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <DotLoader loadingText="이미지 업로드중" />
        </div>
      ) : value ? (
        <Image
          src={value}
          alt="Preview"
          layout="fill"
          objectFit="cover"
          className="rounded-lg shadow-md"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="relative flex flex-col items-center text-gray-500 gap-2">
            <Pawn
              color={pawnColor}
              animation="idle"
              className="w-[70px] h-[70px]"
              paused
            />
            <div className="absolute right-[12px] bottom-[30px] text-2xl">
              📸
            </div>
            <div className="text-sm">이미지를 등록해봐요!</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(ImageUploader);
