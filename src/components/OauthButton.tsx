import React from "react";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";

interface OauthButtonProps {
  type: "GOOGLE" | "KAKAO" | "NAVER";
  onClick: () => void;
}

const OauthButton: React.FC<OauthButtonProps> = ({ type, onClick }) => {
  return (
    <button
      type="button"
      className={`${commonStyles.button} ${buttonStyles[type].button} shadow-[4px_4px_0_#8c7a5c] border border-[#bfae96] transition hover:brightness-105`}
      onClick={onClick}
    >
      {icons[type]}
      <p className={`${commonStyles.text} ${buttonStyles[type].text}`}>
        {type === "GOOGLE" ? "구글" : type === "KAKAO" ? "카카오" : "네이버"}로
        시작하기
      </p>
      <div className="w-7" />
    </button>
  );
};

const icons = {
  GOOGLE: <FcGoogle className="m-1" size={28} />,
  KAKAO: <RiKakaoTalkFill className="m-1" size={28} />,
  NAVER: <SiNaver className="m-2" size={20} color="white" />,
};

const commonStyles = {
  button: "justify-between w-72 h-11 rounded-xl p-1 flex items-center gap-3",
  text: "text-base",
};

const buttonStyles = {
  GOOGLE: {
    button: "bg-white hover:bg-gray-100",
    text: "text-black",
  },
  KAKAO: {
    button: "bg-kakao hover:bg-kakaoHover",
    text: "text-kakaoText",
  },
  NAVER: {
    button: "bg-naver hover:bg-naverHover",
    text: "text-white",
  },
};

export default OauthButton;
