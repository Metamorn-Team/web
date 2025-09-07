import PixelToggle from "@/components/rtc/PixelToggle";
import { useIsMobile } from "@/hook/useIsMobile";
import React from "react";
import {
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
  MdSettings,
} from "react-icons/md";

interface RtcPanelProps {
  camOn: boolean;
  micOn: boolean;
  toggleCam: () => void;
  toggleMic: () => void;
  openSettings: () => void;
}

export default function RtcPanel({
  camOn,
  micOn,
  toggleCam,
  toggleMic,
  openSettings,
}: RtcPanelProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`fixed z-50 ${
        isMobile
          ? "top-16 left-3"
          : "bottom-4 left-1/2 transform -translate-x-1/2"
      }`}
    >
      <div className="flex gap-2">
        <PixelToggle
          active={micOn}
          onClick={toggleMic}
          className={isMobile ? "px-2 py-1" : "gap-1"}
        >
          {micOn ? (
            <MdMic size={20} className="inline" />
          ) : (
            <MdMicOff size={20} className="inline" />
          )}{" "}
          {!isMobile && <p>마이크</p>}
        </PixelToggle>

        <PixelToggle
          active={camOn}
          onClick={toggleCam}
          className={isMobile ? "px-2 py-1" : "gap-1"}
        >
          {camOn ? (
            <MdVideocam size={20} className="inline" />
          ) : (
            <MdVideocamOff size={20} className="inline" />
          )}{" "}
          {!isMobile && " 카메라"}
        </PixelToggle>

        <PixelToggle
          active={false}
          onClick={openSettings}
          className={isMobile ? "px-2 py-1" : "gap-1"}
        >
          <MdSettings size={20} className="inline" />
          {!isMobile && " 설정"}
        </PixelToggle>
      </div>
    </div>
  );
}
