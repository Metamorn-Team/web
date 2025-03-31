import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Ribon from "@/components/common/Ribon";
import ReceivedFriendRequestItemList from "@/components/friend/ReceivedFriendRequestItemList";
import SentFriendRequestItemList from "@/components/friend/SentFriendRequestItemList";
import FriendItmeList from "@/components/FriendItemList";
import React, { Suspense, useCallback, useState } from "react";

interface FriendModalProps {
  onClose: () => void;
}

const menus = {
  "친구 목록": FriendItmeList,
  "받은 요청": ReceivedFriendRequestItemList,
  "보낸 요청": SentFriendRequestItemList,
};

type Menu = keyof typeof menus;

const FriendModal = ({ onClose }: FriendModalProps) => {
  const [selected, setSelected] = useState<Menu>("친구 목록");

  const renderContents = useCallback(() => {
    if (selected === "친구 목록") {
      const Component = menus[selected];
      return <Component friends={friends} />;
    }
    if (selected === "받은 요청") {
      const Component = menus[selected];
      return <Component users={friends} />;
    }
    if (selected === "보낸 요청") {
      const Component = menus[selected];
      return <Component users={friends} />;
    }
  }, [selected]);

  return (
    <Modal onClose={onClose} className="h-3/4">
      <div className="flex flex-col justify-between items-center gap-2 h-full">
        <Ribon title="친구" color="yellow" width={130} fontSize={20} />
        <div className="w-full overflow-scroll my-4 scrollbar-hide">
          <Suspense fallback={<div>로딩 랄라~</div>}>
            {renderContents()}
          </Suspense>
        </div>
        <div className="flex gap-2">
          {Object.keys(menus).map((menu) => (
            <Button
              key={menu}
              title={menu}
              color="yellow"
              width={130}
              fontSize="text-sm"
              isActive={menu === selected}
              onClick={() => setSelected(menu as Menu)}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default FriendModal;

const friends = [
  {
    id: "1",
    profileImageUrl: "/images/slime.png",
    tag: "Magik#19191919",
    nickname: "magik",
  },
  {
    id: "2",
    profileImageUrl: "/images/slime.png",
    tag: "Magik#19191919",
    nickname: "magik",
  },
  {
    id: "3",
    profileImageUrl: "/images/slime.png",
    tag: "Magik#19191919",
    nickname: "magik",
  },
  {
    id: "4",
    profileImageUrl: "/images/slime.png",
    tag: "Magik#19191919",
    nickname: "magik",
  },
  {
    id: "5",
    profileImageUrl: "/images/slime.png",
    tag: "Magik#19191919",
    nickname: "magik",
  },
  {
    id: "6",
    profileImageUrl: "/images/slime.png",
    tag: "Magik#19191919",
    nickname: "magik",
  },
  {
    id: "7",
    profileImageUrl: "/images/slime.png",
    tag: "Magik#19191919",
    nickname: "magik",
  },
  {
    id: "8",
    profileImageUrl: "/images/slime.png",
    tag: "Magik#19191919",
    nickname: "magik",
  },
  {
    id: "9",
    profileImageUrl: "/images/slime.png",
    tag: "Magik#19191919",
    nickname: "magik",
  },
  {
    id: "10",
    profileImageUrl: "/images/slime.png",
    tag: "Magik#19191919",
    nickname: "magik",
  },
];
