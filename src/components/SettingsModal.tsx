"use client";

import { useState, useEffect } from "react";
import RetroModal from "@/components/common/RetroModal";
import { getItem } from "@/utils/persistence";
import { SoundManager } from "@/game/managers/sound-manager";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fpsLimits = [30, 60] as const;
const menus = ["사운드", "성능"] as const;

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const storedSoundVolume = getItem("sound_volume") ?? 1;
  const storedFpsLimit = getItem("fps_limit") ?? 60;

  const [activeMenu, setActiveMenu] =
    useState<(typeof menus)[number]>("사운드");
  const [soundVolume, setSoundVolume] = useState<number>(
    Math.floor(storedSoundVolume * 100)
  );
  const [fpsLimit, setFpsLimit] = useState<number>(storedFpsLimit);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    const soundManager = SoundManager.getInstanceSafe();
    if (soundManager) {
      const volumeWeight = soundVolume / 100;
      SoundManager.getInstance().setVolume(volumeWeight);
    }
  }, [soundVolume, fpsLimit]);

  const handleMenuClick = (menu: (typeof menus)[number]) => {
    setActiveMenu(menu);
  };

  const handleSoundVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSoundVolume(Number(e.target.value)); // 슬라이드 값을 상태로 업데이트
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setSoundVolume(100);
    } else {
      setSoundVolume(0);
    }
    setIsMuted(!isMuted);
  };

  const handleFpsLimitClick = (limit: 30 | 60) => {
    setFpsLimit(limit);
  };

  return (
    <RetroModal isOpen={isOpen} onClose={onClose}>
      <div className="flex w-full h-full">
        <div className="w-1/4 bg-[#f0e9d2] border-[#bfae96] p-4 rounded-lg">
          <ul className="flex flex-col gap-5">
            {menus.map((menu) => (
              <li
                key={menu}
                className={`cursor-pointer text-lg font-semibold text-[#d4a373] transition-all duration-300 hover:text-[#a35f42] ${
                  activeMenu === "사운드" ? "font-bold text-[#8c4510]" : ""
                }`}
                onClick={() => handleMenuClick(menu)}
              >
                {menu}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-3/4 p-6">
          {activeMenu === "사운드" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-[#8c4510]">사운드 설정</h2>
              <div className="mt-6">
                <label className="block text-[#8c4510]">전체 사운드</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundVolume}
                  onChange={handleSoundVolumeChange}
                  className="w-full mt-2"
                />
                <div className="flex justify-between mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleMuteToggle}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                    isMuted
                      ? "bg-[#8c4510] text-white"
                      : "bg-[#d4a373] text-[#8c4510]"
                  } hover:bg-[#a35f42]`}
                >
                  {isMuted ? "음소거 해제" : "음소거"}
                </button>
              </div>
            </div>
          )}

          {activeMenu === "성능" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-[#8c4510]">프레임 설정</h2>
              <div className="flex flex-col mt-6 gap-4">
                <label className="block text-[#8c4510]">FPS 제한</label>
                <div className="flex gap-4 mt-2">
                  {fpsLimits.map((fps) => (
                    <button
                      key={fps}
                      onClick={() => handleFpsLimitClick(fps)}
                      className={`px-5 py-2 rounded-lg transition-all duration-300 ${
                        fpsLimit === fps
                          ? "bg-[#8c4510] text-white"
                          : "bg-[#d4a373] text-[#8c4510]"
                      } hover:bg-[#a35f42]`}
                    >
                      {fps} FPS
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  FPS를 설정하여 성능을 조정하세요. (30, 60)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </RetroModal>
  );
};

export default SettingsModal;
