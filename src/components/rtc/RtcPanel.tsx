import PixelToggle from "@/components/rtc/PixelToggle";
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
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="flex gap-2">
        <PixelToggle active={micOn} onClick={toggleMic}>
          {micOn ? (
            <MdMic size={20} className="inline mr-1" />
          ) : (
            <MdMicOff size={20} className="inline mr-1" />
          )}{" "}
          마이크
        </PixelToggle>

        <PixelToggle active={camOn} onClick={toggleCam}>
          {camOn ? (
            <MdVideocam size={20} className="inline mr-1" />
          ) : (
            <MdVideocamOff size={20} className="inline mr-1" />
          )}{" "}
          카메라
        </PixelToggle>

        <PixelToggle active={false} onClick={openSettings}>
          <MdSettings size={20} className="inline mr-1" /> 설정
        </PixelToggle>
      </div>
    </div>
  );
}
