"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import PlazaGame, { GameRef } from "@/components/PlazaGame";
import { PlazaScene } from "@/game/scenes/plaza-scene";
import MenuHeader from "@/components/MenuHeader";
import { EventBus } from "@/game/event/EventBus";
import { useModal } from "@/hook/useModal";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import Ribon from "@/components/common/Ribon";
import ReceivedFriendRequestItemList from "@/components/friend/ReceivedFriendRequestItemList";
import FriendItmeList from "@/components/FriendItemList";
import SentFriendRequestItemList from "@/components/friend/SentFriendRequestItemList";

const menus = {
  "친구 목록": FriendItmeList,
  "받은 요청": ReceivedFriendRequestItemList,
  "보낸 요청": SentFriendRequestItemList,
};

type Menu = keyof typeof menus;

export default function PlazaGameWrapper() {
  const gameRef = useRef<GameRef | null>(null);
  const [isMute, setIsMute] = useState(false);
  const [selected, setSelected] = useState<Menu>("친구 목록");
  const { isModalOpen, changeModalOpen, close } = useModal();

  const muteToggle = useCallback(() => {
    if (gameRef.current) {
      const scene =
        gameRef.current.game.scene.getScene<PlazaScene>("PlazaScene");
      setIsMute(scene.muteToggle());
    }
  }, [gameRef]);

  useEffect(() => {
    const handleSceneReady = () => {
      console.log("ready!");
    };

    EventBus.on("current-scene-ready", handleSceneReady);

    const handleResize = () => {
      if (gameRef.current) {
        gameRef.current.game.scale.resize(
          window.innerWidth,
          window.innerHeight
        );
        gameRef.current.game.scene.scenes.forEach((scene) => {
          scene.cameras.main.setSize(window.innerWidth, window.innerHeight);
        });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      EventBus.removeListener("current-scene-ready", handleSceneReady);
      window.removeEventListener("resize", handleResize);
    };
  }, [gameRef]);

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
    <div>
      <MenuHeader
        isMute={isMute}
        muteToggle={muteToggle}
        changeFriendModalOpen={changeModalOpen}
      />
      <PlazaGame ref={gameRef} currentActiveScene={() => {}} />

      {isModalOpen ? (
        <Modal onClose={close} className="h-3/4">
          <div className="flex flex-col justify-between items-center gap-2 h-full">
            <Ribon title="친구" color="yellow" width={130} fontSize={20} />
            <div className="w-full overflow-scroll my-4 scrollbar-hide">
              {renderContents()}
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
      ) : null}
    </div>
  );
}

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
