"use client";

import { PAWN_AVATAR_URL } from "@/constants/image-path";
import { playerStore } from "@/game/managers/player-store";
import { useIsMobile } from "@/hook/useIsMobile";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MdMic, MdMicOff } from "react-icons/md";

interface PlayerMediaBoxProps {
  playerId: string;
  isSpeaking?: boolean;
  isLocalPlayer?: boolean;
  isScreenShareBox?: boolean;
  nickname?: string;
  avatarUrl?: string;
  stream?: MediaStream | null;
}

export default function PlayerMediaBox({
  playerId,
  isSpeaking = false,
  isLocalPlayer = false,
  nickname,
  avatarUrl,
  stream = null,
}: PlayerMediaBoxProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [showWave, setShowWave] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [volume, setVolume] = useState(0.5); // 기본 50%

  const isMobile = useIsMobile();

  // 스트림 상태
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);

  const player = playerStore.getPlayer(playerId)?.getPlayerInfo();
  const playerNickname = player?.nickname || "알 수 없음";
  const playerAvatarUrl = PAWN_AVATAR_URL(player?.avatarKey || "blue_pawn.png");

  useEffect(() => {
    setShowWave(Boolean(isSpeaking));
  }, [isSpeaking]);

  // 스트림으로부터 비디오/오디오 상태 계산 & 이벤트 리스너
  useEffect(() => {
    const calc = () => {
      if (!stream) {
        setHasVideo(false);
        setHasAudio(false);
        return;
      }
      const v = stream.getVideoTracks().some((t) => t.enabled);
      const a = stream.getAudioTracks().some((t) => t.enabled);
      setHasVideo(v);
      setHasAudio(a);
    };

    calc();

    if (!stream) return;

    const onAdd = () => calc();
    const onRemove = () => calc();

    stream.addEventListener("addtrack", onAdd);
    stream.addEventListener("removetrack", onRemove);

    const trackListeners: Array<() => void> = [];
    stream.getTracks().forEach((track) => {
      const onEndedOrMute = () => calc();
      track.addEventListener("mute", onEndedOrMute);
      track.addEventListener("unmute", onEndedOrMute);
      trackListeners.push(() => {
        track.removeEventListener("mute", onEndedOrMute);
        track.removeEventListener("unmute", onEndedOrMute);
      });
    });

    return () => {
      stream.removeEventListener("addtrack", onAdd);
      stream.removeEventListener("removetrack", onRemove);
      trackListeners.forEach((fn) => fn());
    };
  }, [
    stream,
    stream ? stream.getVideoTracks().length : 0,
    stream ? stream.getAudioTracks().length : 0,
  ]);

  // video element에 stream 바인딩
  useLayoutEffect(() => {
    const vEl = videoRef.current;
    if (!vEl) return;

    if (vEl.srcObject !== stream) {
      vEl.srcObject = stream ?? null;
    }

    if (isLocalPlayer) vEl.muted = true;

    if (stream) {
      vEl.play().catch((e) => console.warn("video.play() failed:", e));
    }
  }, [
    stream,
    isLocalPlayer,
    stream?.getVideoTracks().length,
    stream?.getAudioTracks().length,
  ]);

  // volume 상태가 변하면 audioRef에 반영
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleClick = () => setIsFullscreen((s) => !s);
  const isShowingScreenShare = false;

  return (
    <>
      {isFullscreen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
          onClick={handleClick}
        />
      )}

      <div
        className={`${
          isFullscreen
            ? "fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            : ""
        }`}
      >
        <div
          className={`relative ${
            isFullscreen
              ? `${
                  isMobile ? "w-[95vw] aspect-square" : "w-[90vw] h-[80vh]"
                } border-4 rounded-2xl border-[#bfae96] shadow-[8px_8px_0_#8c7a5c] pointer-events-auto cursor-pointer`
              : `border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] cursor-pointer hover:shadow-[6px_6px_0_#8c7a5c] transition-shadow duration-200 transform border-2 rounded-lg ${
                  isMobile ? "w-28 h-24" : "w-40 h-32"
                } ${
                  showWave
                    ? "border-pink-400 ring-4 ring-pink-300 ring-offset-2 ring-offset-[#fdf8ef] shadow-[6px_6px_0_#b97ea0] scale-105"
                    : ""
                }`
          } bg-[#fdf8ef] overflow-hidden`}
          onClick={handleClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {showWave && !isFullscreen && (
            <>
              <div className="absolute inset-0 rounded-lg border-2 border-pink-300 pointer-events-none animate-pulse opacity-80"></div>
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-pink-300 shadow-[2px_2px_0_#8c7a5c] animate-bounce"></div>
            </>
          )}

          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full ${
                isShowingScreenShare
                  ? "object-contain bg-black"
                  : isFullscreen
                  ? "object-contain"
                  : "object-cover"
              } ${isShowingScreenShare ? "" : "transform scale-x-[-1]"} ${
                hasVideo ? "" : "hidden"
              }`}
            />

            <div
              className={`w-full h-full flex items-center justify-center ${
                hasVideo ? "hidden" : ""
              }`}
            >
              <div
                className={`bg-[#f5f1e6] border-2 border-[#bfae96] rounded-full flex items-center justify-center overflow-hidden ${
                  isFullscreen
                    ? "w-48 h-48 border-4"
                    : isMobile
                    ? "w-12 h-12"
                    : "w-14 h-14"
                }`}
              >
                <Image
                  src={avatarUrl || playerAvatarUrl}
                  alt={nickname || playerNickname}
                  width={isFullscreen ? 160 : isMobile ? 36 : 40}
                  height={isFullscreen ? 160 : isMobile ? 36 : 40}
                  className="object-cover"
                />
              </div>
            </div>

            {!isLocalPlayer && stream && (
              <audio
                autoPlay
                playsInline
                ref={(el) => {
                  if (el && el.srcObject !== stream) el.srcObject = stream;
                  audioRef.current = el;
                }}
                className="hidden"
              />
            )}

            {!isFullscreen ? (
              <div className="absolute top-0 left-0 right-0 py-1 px-2 truncate text-xs">
                {nickname || playerNickname}
              </div>
            ) : null}

            <div
              className={`absolute top-1 right-1 flex gap-1 ${
                isFullscreen ? "scale-150" : ""
              }`}
            >
              {isShowingScreenShare && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  title="화면공유"
                >
                  <span className="text-xs">🖥️</span>
                </div>
              )}

              {hasVideo && !isShowingScreenShare && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  title="카메라 켜짐"
                ></div>
              )}

              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                title="마이크"
              >
                {hasAudio ? <MdMic color="green" /> : <MdMicOff color="red" />}
              </div>
            </div>

            {isFullscreen && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                {nickname || playerNickname}
              </div>
            )}

            {/* hover 시 볼륨 슬라이더 */}
            {isHovering && !isFullscreen && !isLocalPlayer && (
              <div className="absolute bottom-1 left-1 right-1 flex justify-center">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                  className="
                  mb-1
    w-24 
    accent-[#bfae96]
    bg-[#d6c3a6]
    rounded-lg
    appearance-none
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-[#8c7a5c]
    [&::-webkit-slider-thumb]:shadow-md
    [&::-moz-range-thumb]:h-4
    [&::-moz-range-thumb]:w-4
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:bg-[#8c7a5c]
    [&::-moz-range-thumb]:border-none
  "
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
