import PixelToggle from "@/components/rtc/PixelToggle";
import React from "react";
import {
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
  MdScreenShare,
  MdStopScreenShare,
} from "react-icons/md";

interface RtcPanelProps {
  camOn: boolean;
  micOn: boolean;
  screenSharing: boolean;
  mediaInitialized: boolean;
  toggleCam: () => void;
  toggleMic: () => void;
  toggleScreenShare: () => void;
  stopUserMedia: () => void;
}

export default function RtcPanel({
  camOn,
  micOn,
  screenSharing,
  mediaInitialized,
  toggleCam,
  toggleMic,
  toggleScreenShare,
  stopUserMedia,
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
        {/* <PixelToggle active={screenSharing} onClick={toggleScreenShare}>
          {screenSharing ? (
            <MdStopScreenShare size={20} className="inline mr-1" />
          ) : (
            <MdScreenShare size={20} className="inline mr-1" />
          )}{" "}
          화면
        </PixelToggle> */}
      </div>
    </div>
  );
}
