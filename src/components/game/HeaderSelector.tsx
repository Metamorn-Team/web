import React from "react";
import MenuHeader from "@/components/MenuHeader";
import PrivateIslandHeader from "@/components/game/PrivateIslandHeader";

interface MenuHeaderProps {
  onFriendModalOpen: () => void;
  onSettingsModalOpen: () => void;
  onDevModalOpen: () => void;
  onUpdateOpen: () => void;
  onIslandInfoModalOpen: () => void;
}

interface PrivateHeaderProps {
  onInviteModalOpen: () => void;
  onPrivateSettingsOpen: () => void;
}

interface HeaderSelectorProps
  extends Partial<MenuHeaderProps>,
    Partial<PrivateHeaderProps> {
  type: "default" | "private";
  onExitModalOpen: () => void;
}

export default function HeaderSelector(props: HeaderSelectorProps) {
  const { type } = props;

  switch (type) {
    case "private":
      return (
        <PrivateIslandHeader
          // 공통
          onFriendModalOpen={props.onFriendModalOpen ?? (() => {})}
          onSettingsModalOpen={props.onSettingsModalOpen ?? (() => {})}
          onDevModalOpen={props.onDevModalOpen ?? (() => {})}
          onUpdateOpen={props.onUpdateOpen ?? (() => {})}
          onIslandInfoModalOpen={props.onIslandInfoModalOpen ?? (() => {})}
          // 비밀섬
          onInviteModalOpen={props.onInviteModalOpen ?? (() => {})}
          onExitModalOpen={props.onExitModalOpen ?? (() => {})}
        />
      );
    case "default":
    default:
      return (
        <MenuHeader
          onFriendModalOpen={props.onFriendModalOpen ?? (() => {})}
          onSettingsModalOpen={props.onSettingsModalOpen ?? (() => {})}
          onDevModalOpen={props.onDevModalOpen ?? (() => {})}
          onUpdateOpen={props.onUpdateOpen ?? (() => {})}
          onIslandInfoModalOpen={props.onIslandInfoModalOpen ?? (() => {})}
          // onExitModalOpen={props.onExitModalOpen ?? (() => {})}
        />
      );
  }
}
