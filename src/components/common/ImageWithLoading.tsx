"use client";

import Image from "next/image";
import { DotLoader } from "./DotLoader";
import ErrorFallback from "./ErrorFallback";
import { useState } from "react";

interface ImageWithLoadingProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
}

export default function ImageWithLoading({
  src,
  alt,
  width,
  height,
  className,
  fill,
}: ImageWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleOnImageLoad = () => {
    setIsLoading(false);
  };

  const handleOnImageError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  return (
    <>
      {/* 로딩 상태 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <DotLoader loadingText="불러오는 중" />
        </div>
      )}

      {/* 에러 상태 */}
      {isError && <ErrorFallback message="이미지를 불러올 수 없습니다" />}

      {!isError && (
        <Image
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          } ${className}`}
          fill={fill}
          width={width}
          height={height}
          onLoad={handleOnImageLoad}
          onError={handleOnImageError}
        />
      )}
    </>
  );
}
