"use client";

import React from "react";

interface PixelLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

// 귀여운 하트 로더
export default function PixelLoader({
  size = "md",
  className = "",
  color = "#FF6B9D", // 핑크색
}: PixelLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const pixelSize = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* 하트 모양 픽셀 아트 */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-0.5">
        {/* 하트 모양의 픽셀들 */}
        {/* 첫 번째 줄 */}
        <div className="col-start-2 col-end-3 row-start-1 row-end-2" />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "0ms",
            animationDuration: "1.5s",
          }}
        />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "150ms",
            animationDuration: "1.5s",
          }}
        />
        <div className="col-start-5 col-end-6 row-start-1 row-end-2" />

        {/* 두 번째 줄 */}
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "300ms",
            animationDuration: "1.5s",
          }}
        />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "450ms",
            animationDuration: "1.5s",
          }}
        />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "600ms",
            animationDuration: "1.5s",
          }}
        />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "750ms",
            animationDuration: "1.5s",
          }}
        />

        {/* 세 번째 줄 */}
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "900ms",
            animationDuration: "1.5s",
          }}
        />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "1050ms",
            animationDuration: "1.5s",
          }}
        />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "1200ms",
            animationDuration: "1.5s",
          }}
        />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "1350ms",
            animationDuration: "1.5s",
          }}
        />

        {/* 네 번째 줄 */}
        <div className="col-start-1 col-end-2 row-start-4 row-end-5" />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "1500ms",
            animationDuration: "1.5s",
          }}
        />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "1650ms",
            animationDuration: "1.5s",
          }}
        />
        <div className="col-start-6 col-end-7 row-start-4 row-end-5" />

        {/* 다섯 번째 줄 */}
        <div className="col-start-2 col-end-3 row-start-5 row-end-6" />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "1800ms",
            animationDuration: "1.5s",
          }}
        />
        <div className="col-start-5 col-end-6 row-start-5 row-end-6" />

        {/* 여섯 번째 줄 */}
        <div className="col-start-3 col-end-4 row-start-6 row-end-7" />
      </div>
    </div>
  );
}

// 귀여운 별 로더
export function StarPixelLoader({
  size = "md",
  className = "",
  color = "#FFD700", // 골드색
}: PixelLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const pixelSize = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-0.5">
        {/* 별 모양의 픽셀들 */}
        <div className="col-start-3 col-end-4 row-start-1 row-end-2" />
        <div className="col-start-1 col-end-2 row-start-2 row-end-3" />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "0ms",
            animationDuration: "1.2s",
          }}
        />
        <div className="col-start-5 col-end-6 row-start-2 row-end-3" />
        <div className="col-start-2 col-end-3 row-start-3 row-end-4" />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "200ms",
            animationDuration: "1.2s",
          }}
        />
        <div className="col-start-4 col-end-5 row-start-3 row-end-4" />
        <div className="col-start-1 col-end-2 row-start-4 row-end-5" />
        <div
          className={`${pixelSize[size]} animate-pulse`}
          style={{
            backgroundColor: color,
            animationDelay: "400ms",
            animationDuration: "1.2s",
          }}
        />
        <div className="col-start-5 col-end-6 row-start-4 row-end-5" />
        <div className="col-start-3 col-end-4 row-start-5 row-end-6" />
      </div>
    </div>
  );
}

// 귀여운 점 3개 로더 (더 귀엽게)
export function SimplePixelLoader({
  size = "md",
  className = "",
  color = "#FF6B9D",
}: PixelLoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-bounce`}
        style={{
          backgroundColor: color,
          animationDelay: "0ms",
          animationDuration: "1s",
        }}
      />
      <div
        className={`${sizeClasses[size]} animate-bounce`}
        style={{
          backgroundColor: color,
          animationDelay: "200ms",
          animationDuration: "1s",
        }}
      />
      <div
        className={`${sizeClasses[size]} animate-bounce`}
        style={{
          backgroundColor: color,
          animationDelay: "400ms",
          animationDuration: "1s",
        }}
      />
    </div>
  );
}

// 귀여운 바 로더 (둥근 모서리)
export function PixelBarLoader({
  size = "md",
  className = "",
  color = "#FF6B9D",
}: PixelLoaderProps) {
  const sizeClasses = {
    sm: "w-12 h-3",
    md: "w-16 h-4",
    lg: "w-20 h-5",
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden ${className}`}
    >
      <div
        className="h-full rounded-full animate-pulse"
        style={{
          backgroundColor: color,
          animationDuration: "1.5s",
        }}
      />
    </div>
  );
}

// 귀여운 원형 로더 (점들이 원을 그리며 회전)
export function CircularPixelLoader({
  size = "md",
  className = "",
  color = "#FF6B9D",
}: PixelLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const pixelSize = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 animate-spin">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`${pixelSize[size]} absolute rounded-full animate-pulse`}
            style={{
              backgroundColor: color,
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${
                i * 45
              }deg) translateY(-${
                size === "sm" ? "12px" : size === "md" ? "18px" : "24px"
              })`,
              animationDelay: `${i * 100}ms`,
              animationDuration: "1.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
