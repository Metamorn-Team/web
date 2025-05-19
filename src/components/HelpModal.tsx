import RetroModal from "@/components/common/RetroModal";
import classNames from "classnames";
import React from "react";

export interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const HelpModal = ({ isOpen, onClose, className }: HelpModalProps) => {
  return (
    <RetroModal
      isOpen={isOpen}
      onClose={onClose}
      className={classNames("!max-w-[600px]", className)}
    >
      <div className="space-y-3 text-sm text-[#3d2c1b]">
        <h2 className="text-lg font-bold">👾 리브아일랜드에 힘을 주세요</h2>
        <p>안녕하세요!</p>
        <p>
          리브아일랜드는 가난한 취준생 개발자가 밤낮없이 코딩하며 만든 작은 픽셀
          세계예요.
        </p>
        <p>
          귀여운 섬과 친구들이 마음에 드셨다면, 아래 정보를 참고해주시면 큰 힘이
          됩니다 🌱
        </p>
        <p>
          리브아일랜드에 대해 궁금한 점이 있다면 언제든 편하게 연락 주세요! 📨
        </p>

        <ul className="list-disc pl-5 space-y-1 mt-4">
          <li>
            💬 문의:{" "}
            <a
              href="https://open.kakao.com/o/sMYWPgxh"
              target="_blank"
              className="underline text-blue-600"
            >
              오픈카톡 링크
            </a>
          </li>
          <li>💗 후원 계좌: 카카오뱅크 3333097170775 강*성</li>
        </ul>
        <p className="text-xs text-gray-500">관심 주셔서 감사합니다!</p>
      </div>
    </RetroModal>
  );
};

export default HelpModal;
