"use client";

import { useEffect, useRef, useState } from "react";
import RetroModal from "@/components/common/RetroModal";
import RetroSelect from "@/components/common/RetroSelect";

interface RtcSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMicId?: string;
  selectedCamId?: string;
  changeMicDevice: (deviceId: string | undefined) => Promise<void>;
  changeCamDevice: (deviceId: string | undefined) => Promise<void>;
}

export default function RtcSettingsModal({
  isOpen,
  onClose,
  selectedMicId,
  selectedCamId,
  changeMicDevice,
  changeCamDevice,
}: RtcSettingsModalProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [micLevel, setMicLevel] = useState(0);

  const [hasCamPermission, setHasCamPermission] = useState(true);
  const [hasMicPermission, setHasMicPermission] = useState(true);

  const animationRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  /** 공통 정리 함수 */
  const clearResources = async () => {
    console.log("clearResources called");

    // 1. 애니메이션 루프 종료
    if (animationRef.current) {
      console.log("Cancelling animation frame", animationRef.current);
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
    }

    // 2. 마이크 스트림 종료
    if (micStreamRef.current) {
      console.log("Stopping mic tracks");
      micStreamRef.current.getTracks().forEach((track) => {
        console.log("Stopping mic track", track.kind, track.readyState);
        track.stop();
      });
      micStreamRef.current = null;
    }

    // 3. AudioContext 정리
    if (audioCtxRef.current) {
      console.log("Closing AudioContext");
      if (analyserRef.current) {
        console.log("Disconnecting analyser");
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }

    // 4. 카메라 스트림 종료
    if (previewStreamRef.current) {
      console.log("Stopping preview tracks");
      previewStreamRef.current.getTracks().forEach((track) => {
        console.log("Stopping camera track", track.kind, track.readyState);
        track.stop();
      });
      previewStreamRef.current = null;
    }

    // 5. 비디오 엘리먼트 srcObject 제거
    if (videoRef.current) {
      console.log("Removing video srcObject");
      videoRef.current.srcObject = null;
    }

    // 6. 브라우저가 리소스를 완전히 해제할 시간을 줌
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log("Resources cleared");
  };

  /** 닫기 핸들러 (자원 정리 포함) */
  const handleClose = async () => {
    await clearResources();
    onClose();
  };

  // 모달 열림/닫힘 시 디바이스 초기화
  useEffect(() => {
    console.log("Modal isOpen:", isOpen);
    if (isOpen) {
      navigator.mediaDevices.enumerateDevices().then((all) => {
        console.log("Devices found:", all);
        setDevices(all);
      });
    } else {
      clearResources();
    }

    return () => {
      console.log("Component unmount or modal change cleanup");
      clearResources();
    };
  }, [isOpen]);

  // 카메라 프리뷰
  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false; // cleanup 플래그 추가
    const videoElement = videoRef.current; // ref를 변수에 저장

    const setupCamPreview = async () => {
      try {
        // 이전 스트림 정리
        if (previewStreamRef.current) {
          console.log("Stopping previous camera tracks before setup");
          previewStreamRef.current.getTracks().forEach((track) => {
            console.log("Stopping track:", track.kind, track.readyState);
            track.stop();
          });
          previewStreamRef.current = null;
        }

        // 비디오 엘리먼트 초기화
        if (videoElement) {
          videoElement.srcObject = null;
        }

        // 약간의 지연을 두어 이전 스트림이 완전히 해제되도록 함
        await new Promise((resolve) => setTimeout(resolve, 100));

        // 취소되었다면 새로운 스트림 생성하지 않음
        if (isCancelled) return;

        const constraints = selectedCamId
          ? {
              video: {
                deviceId: { exact: selectedCamId, width: 1280, height: 720 },
              },
            }
          : { video: true };

        console.log(
          "Creating new camera stream with constraints:",
          constraints
        );
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // 취소되었다면 새로 생성된 스트림도 바로 정리
        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        console.log("Camera stream obtained", stream);
        previewStreamRef.current = stream;
        setHasCamPermission(true);

        if (videoElement && !isCancelled) {
          videoElement.srcObject = stream;
        }
      } catch (err) {
        console.warn("Cam preview error", err);
        if (!isCancelled) {
          setHasCamPermission(false);
        }
      }
    };

    setupCamPreview();

    return () => {
      console.log("Cleaning up camera effect");
      isCancelled = true; // 취소 플래그 설정

      if (previewStreamRef.current) {
        previewStreamRef.current.getTracks().forEach((track) => {
          console.log(
            "Stopping camera track in effect cleanup",
            track.kind,
            track.readyState
          );
          track.stop();
        });
        previewStreamRef.current = null;
      }

      // 비디오 엘리먼트도 즉시 정리
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [selectedCamId, isOpen]);

  // 마이크 테스트
  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false; // cleanup 플래그 추가

    const setupMicTest = async () => {
      try {
        // 이전 스트림 정리
        if (micStreamRef.current) {
          console.log("Stopping previous mic tracks before setup");
          micStreamRef.current.getTracks().forEach((track) => track.stop());
          micStreamRef.current = null;
        }

        // 이전 애니메이션 정리
        if (animationRef.current) {
          console.log(
            "Cancelling previous animation frame before setup",
            animationRef.current
          );
          cancelAnimationFrame(animationRef.current);
          animationRef.current = 0;
        }

        // 이전 AudioContext 정리
        if (audioCtxRef.current) {
          if (analyserRef.current) {
            analyserRef.current.disconnect();
            analyserRef.current = null;
          }
          audioCtxRef.current.close();
          audioCtxRef.current = null;
        }

        // 약간의 지연을 두어 이전 리소스가 완전히 해제되도록 함
        await new Promise((resolve) => setTimeout(resolve, 100));

        // 취소되었다면 새로운 스트림 생성하지 않음
        if (isCancelled) return;

        const constraints = selectedMicId
          ? { audio: { deviceId: { exact: selectedMicId } } }
          : { audio: true };

        console.log("Creating new mic stream with constraints:", constraints);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // 취소되었다면 새로 생성된 스트림도 바로 정리
        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        console.log("Mic stream obtained", stream);
        micStreamRef.current = stream;
        setHasMicPermission(true);

        if (isCancelled) return;

        const audioCtx = new AudioContext();
        audioCtxRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyserRef.current = analyser;
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const draw = () => {
          if (!analyserRef.current || isCancelled) return;

          analyserRef.current.getByteTimeDomainData(dataArray);

          let sumSquares = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const value = (dataArray[i] - 128) / 128;
            sumSquares += value * value;
          }
          const rms = Math.sqrt(sumSquares / dataArray.length);
          const scaled = rms * 500;

          if (!isCancelled) {
            setMicLevel(Math.min(100, scaled));
            animationRef.current = requestAnimationFrame(draw);
          }
        };

        if (!isCancelled) {
          draw();
        }
      } catch (err) {
        console.warn("Mic test error", err);
        if (!isCancelled) {
          setHasMicPermission(false);
        }
      }
    };

    setupMicTest();

    return () => {
      console.log("Cleaning up mic effect");
      isCancelled = true; // 취소 플래그 설정

      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => {
          console.log(
            "Stopping mic track in effect cleanup",
            track.kind,
            track.readyState
          );
          track.stop();
        });
        micStreamRef.current = null;
      }

      if (animationRef.current) {
        console.log(
          "Cancelling animation frame in mic cleanup",
          animationRef.current
        );
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }

      if (audioCtxRef.current) {
        if (analyserRef.current) {
          analyserRef.current.disconnect();
          analyserRef.current = null;
        }
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [selectedMicId, isOpen]);

  return (
    <RetroModal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-lg font-bold mb-4">설정</h2>

      {/* 카메라 프리뷰 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-bold text-[#5c4b36]">
            카메라 미리보기
          </label>
          <label className="block text-xs font-semibold  text-gray-500">
            미리보기는 다른 사람에겐 보이지 않아요!
          </label>
        </div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full aspect-video rounded-lg border-2 border-[#bfae96] shadow-md bg-black transform scale-x-[-1]"
        />
      </div>

      <div className="flex flex-col gap-4">
        {/* 카메라 선택 */}
        <RetroSelect
          label="카메라"
          value={selectedCamId || ""}
          options={
            hasCamPermission
              ? [
                  { label: "기본 카메라", value: "" },
                  ...devices
                    .filter((d) => d.kind === "videoinput")
                    .map((d) => ({
                      label: d.label || `카메라 ${d.deviceId.slice(-4)}`,
                      value: d.deviceId,
                    })),
                ]
              : [{ label: "카메라 권한 없음", value: "" }]
          }
          disabled={!hasCamPermission}
          onChange={changeCamDevice}
        />

        {/* 마이크 선택 */}
        <RetroSelect
          label="마이크"
          value={selectedMicId || ""}
          options={
            hasMicPermission
              ? [
                  { label: "기본 마이크", value: "" },
                  ...devices
                    .filter((d) => d.kind === "audioinput")
                    .map((d) => ({
                      label: d.label || `마이크 ${d.deviceId.slice(-4)}`,
                      value: d.deviceId,
                    })),
                ]
              : [{ label: "마이크 권한 없음", value: "" }]
          }
          disabled={!hasMicPermission}
          onChange={changeMicDevice}
        />

        {/* 마이크 테스트 */}
        {hasMicPermission && (
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-[#5c4b3c]">
              마이크 테스트
            </label>
            <div className="w-full h-5 bg-[#f2e8dc] border-2 border-[#bfae96] rounded-full relative overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 rounded-full transition-[width] duration-150 ease-out"
                style={{ width: `${micLevel}%` }}
              />
              <div className="absolute inset-0 border-2 border-dotted border-[#d1bfa3] rounded-full pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    </RetroModal>
  );
}
