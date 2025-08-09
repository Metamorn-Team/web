import React, { useRef } from "react";
import Image from "next/image";
import { getPresignedUrl, uploadImage } from "@/api/file";
import { BUCKET_PATH, CDN_URL } from "@/constants/image-path";
import Alert from "@/utils/alert";
import Pawn from "./Pawn";
import { getRandomPawnColor } from "@/utils/random";

interface ImageUploaderProps {
  value?: string; // 현재 선택된 이미지 URL
  onChange: (url: string) => void; // 업로드 성공 시 호출
  bucketPath?: string; // S3 업로드 경로 (기본값: ISLAND)
  aspectRatio?: string; // Tailwind aspect-[w/h] 형태, 기본값: 4/3
  maxWidth?: string; // 최대 너비 Tailwind 클래스, 기본값: max-w-[330px]
  borderColor?: string; // 테두리 색상
}

export default function ImageUploader({
  value,
  onChange,
  bucketPath = BUCKET_PATH.ISLAND,
  aspectRatio = "aspect-[4/3]",
  maxWidth = "max-w-[330px]",
  borderColor = "#8c7a5c",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) {
        Alert.error("이미지 업로드에 실패했어요..");
        return;
      }

      const { presignedUrl, key } = await getPresignedUrl({ path: bucketPath });
      await uploadImage(presignedUrl, file);
      onChange(`${CDN_URL}/${key}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      Alert.error("이미지 업로드에 실패했어요..");
    }
  };

  return (
    <div
      className={`relative mt-4 flex justify-center items-center ${maxWidth} w-2/3 ${aspectRatio} border border-[${borderColor}] rounded-lg cursor-pointer overflow-hidden`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {value ? (
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
              color={getRandomPawnColor()}
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
