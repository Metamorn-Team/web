import React, { useState } from "react";
import RetroModal from "@/components/common/RetroModal";
import { FiCopy, FiShare2, FiCheck } from "react-icons/fi";
import { BiQr } from "react-icons/bi";
import QRCode from "react-qr-code";
import Image from "next/image";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteUrl: string;
}

// 공유 버튼 공통 컴포넌트
interface ShareButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  title?: string;
}

const ShareButton = ({
  onClick,
  className = "",
  children,
  title,
}: ShareButtonProps) => (
  <button
    className={`flex items-center gap-2 justify-center border border-[#bfae96] rounded-lg text-xs sm:text-sm font-bold min-w-[110px] min-h-[44px] shadow-sm transition-colors ${className}`}
    onClick={onClick}
    title={title}
    type="button"
  >
    {children}
  </button>
);

const InviteModal = ({ isOpen, onClose, inviteUrl }: InviteModalProps) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("복사에 실패했습니다. 수동으로 복사해 주세요.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "내 섬에 초대합니다!",
        url: inviteUrl,
      });
    } else {
      alert("이 브라우저는 웹 공유를 지원하지 않습니다.");
    }
  };

  return (
    <RetroModal isOpen={isOpen} onClose={onClose} className="!max-w-[600px]">
      <div className="flex flex-col items-center gap-6 p-2">
        <div className="relative w-24 h-12">
          <Image
            src={"/images/pawn_friend.png"}
            fill
            objectFit="cover"
            alt="친구"
          />
        </div>
        <h2 className="text-base font-bold mb-1">친구를 섬에 초대해보아요!</h2>
        <div className="w-full flex flex-col items-center gap-1">
          <div className="flex items-center w-full bg-[#f5f1e6] border border-[#bfae96] rounded-lg px-2 py-1 min-h-[48px]">
            <span
              className={`flex-1 text-xs sm:text-base font-semibold break-all select-all transition-colors duration-200 ${
                copied ? "text-green-600" : ""
              }`}
            >
              {inviteUrl}
            </span>
            <button
              className="ml-3 text-[#8c7a5c] hover:text-[#3d2c1b] p-2 rounded-full transition-colors"
              onClick={handleCopy}
              title="복사"
            >
              {copied ? (
                <FiCheck
                  size={22}
                  className="text-green-600 transition-colors"
                />
              ) : (
                <FiCopy size={22} />
              )}
            </button>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3 mt-2 w-full justify-center">
          <ShareButton
            className="bg-[#fff] hover:bg-[#f5f1e6] text-[#3d2c1b]"
            onClick={handleShare}
            title="공유"
          >
            <FiShare2 size={20} />
            공유하기
          </ShareButton>
          <ShareButton
            className="bg-[#fff] hover:bg-[#f5f1e6] text-[#3d2c1b]"
            onClick={() => setShowQr(true)}
            title="QR로 공유"
          >
            <BiQr size={20} />
            QR로 공유
          </ShareButton>
        </div>
        {showQr && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
            <div className="bg-white rounded-xl p-6 flex flex-col items-center shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-2xl text-[#8c7a5c] hover:text-[#e57373] font-bold transition-colors duration-150"
                onClick={() => setShowQr(false)}
                aria-label="QR 닫기"
              >
                ×
              </button>
              <QRCode value={inviteUrl} size={180} />
              <div className="mt-3 text-xs text-[#8c7a5c] text-center">
                스마트폰으로 QR코드를 스캔해 바로 접속하거나 공유하세요!
              </div>
            </div>
          </div>
        )}
        <div className="text-xs text-[#8c7a5c] mt-1 text-center leading-tight break-keep">
          초대 링크를 복사하거나, 카카오톡/트위터로 바로 공유할 수 있습니다.
          <br />
          친구가 이 링크로 접속하면 바로 내 섬에 입장할 수 있어요!
        </div>
      </div>
    </RetroModal>
  );
};

export default InviteModal;
