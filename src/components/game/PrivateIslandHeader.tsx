import React from "react";
import RetroHeader from "@/components/common/header/RetroHeader";
import Dropdown from "@/components/common/dropdown/Dropdown";
import DropdownItem from "@/components/common/dropdown/DropdownItem";
import RetroHeaderButton from "@/components/common/header/RetroHeaderButton";
import { useBgmToggle } from "@/hook/useBgmToggle";
import BgmToggleButton from "@/components/common/header/BgmToggleButton";
import StoreButton from "@/components/common/header/StoreButton";
// import { FaCompass } from "react-icons/fa";
import Image from "next/image";
import {
  FiFileText,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiShield,
  FiUser,
  FiUserPlus,
} from "react-icons/fi";
import { EventWrapper } from "@/game/event/EventBus";
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from "@/constants/constants";
import { getItem, removeItem } from "@/utils/persistence";
import { useLogout } from "@/hook/queries/useLogout";
import Alert from "@/utils/alert";
import FriendButton from "../common/header/FriendButton";
import { useFriendEvent } from "@/hook/useFriendEvent";
import { useGetUnreadFriendRequest } from "@/hook/queries/useGetUnreadFriendRequest";

interface PrivateIslandHeaderProps {
  onFriendModalOpen: () => void;
  onSettingsModalOpen: () => void;
  onDevModalOpen: () => void;
  onUpdateOpen: () => void;
  onIslandInfoModalOpen: () => void;
  onInviteModalOpen: () => void;
  onExitModalOpen: () => void;
}

export default function PrivateIslandHeader({
  onFriendModalOpen,
  onSettingsModalOpen,
  onDevModalOpen,
  onUpdateOpen,
  // onIslandInfoModalOpen,
  onInviteModalOpen,
  onExitModalOpen,
}: PrivateIslandHeaderProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { isPlayBgm, toggleBgm } = useBgmToggle();
  const { mutate: logoutMutate } = useLogout(
    () => {
      if (window.Kakao && window.Kakao.isInitialized()) {
        window.Kakao.Auth.logout();
      }

      removeItem("access_token");
      removeItem("profile");
      window.location.reload();
    },
    () => Alert.error("로그아웃에 실패했어요.. 나중에 다시 시도해주세요.")
  );

  // 친구 요청 이벤트 수신
  const { showNewRequestMessage } = useFriendEvent();
  const { data: unreadRequestCount } = useGetUnreadFriendRequest();

  const onLogout = () => logoutMutate();

  // TODO 상태 검증 필요
  const isLogined = !!getItem("access_token");

  return (
    <RetroHeader
      leftItems={
        <>
          <BgmToggleButton isPlayBgm={isPlayBgm} onClick={toggleBgm} />
          <FriendButton
            unreadRequestCount={unreadRequestCount}
            showNewRequestMessage={showNewRequestMessage}
            onClick={onFriendModalOpen}
          />
          <StoreButton />
          <RetroHeaderButton
            icon={<FiUserPlus size={20} />}
            label="초대"
            onClick={onInviteModalOpen}
          />
        </>
      }
      rightItems={
        <>
          {/* <RetroHeaderButton
            icon={<FaCompass size={20} />}
            label="섬 정보"
            onClick={onIslandInfoModalOpen}
          /> */}
          <RetroHeaderButton
            icon={<FiLogOut size={20} />}
            onClick={onExitModalOpen}
          />
          <Dropdown
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            anchor={
              <RetroHeaderButton
                icon={<FiMenu size={20} />}
                onClick={() => setMenuOpen((prev) => !prev)}
              />
            }
            className="w-44 bg-[#fdf8ef] border border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] p-2 flex flex-col gap-2 text-sm text-[#3d2c1b] animate-fadeIn rounded-[6px] sm:mt-2"
          >
            <DropdownItem
              icon={
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}/asset/image/axe_pawn.png`}
                  width={34}
                  height={40}
                  alt="리브아일랜드에 힘을 주세요"
                />
              }
              label={
                <>
                  리브아일랜드에 <br /> 힘을 주세요
                </>
              }
              onClick={onDevModalOpen}
            />
            {isLogined ? (
              <DropdownItem
                icon={<FiLogOut />}
                label="로그아웃"
                onClick={onLogout}
              />
            ) : (
              <DropdownItem
                icon={<FiUser />}
                label="로그인"
                onClick={() => EventWrapper.emitToUi("openLoginModal")}
              />
            )}
            <DropdownItem
              icon={<FiMenu />}
              label="업데이트 노트"
              onClick={onUpdateOpen}
            />
            <DropdownItem
              icon={<FiSettings />}
              label="환경 설정"
              onClick={onSettingsModalOpen}
            />
            <DropdownItem
              icon={<FiFileText />}
              label="이용 약관"
              onClick={() => window.open(TERMS_OF_USE_URL, "_blank")}
            />
            <DropdownItem
              icon={<FiShield />}
              label="개인정보 처리방침"
              onClick={() => window.open(PRIVACY_POLICY_URL, "_blank")}
            />
          </Dropdown>
        </>
      }
    />
  );
}
