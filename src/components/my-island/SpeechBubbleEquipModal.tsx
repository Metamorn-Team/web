"use client";

import { Suspense, useEffect, useState } from "react";
import RetroSideModal from "@/components/common/RetroSideModal";
import RetroButton from "@/components/common/RetroButton";
import Image from "next/image";
import { useGetAllOwnedItems } from "@/hook/queries/useGetAllOwnedItems";
import { DotLoader } from "@/components/common/DotLoader";
import { EventWrapper } from "@/game/event/EventBus";
import { useEquipItem } from "@/hook/queries/useEquipItem";
import { useUnequipItem } from "@/hook/queries/useUnequipItem";
import { useGetEquippedItems } from "@/hook/queries/useGetEquippedItems";
import { QUERY_KEY as EQUIPPED_ITEMS_QUERY_KEY } from "@/hook/queries/useGetEquippedItems";
import { useQueryClient } from "@tanstack/react-query";

interface SpeechBubbleEquipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpeechBubbleEquipModal({
  isOpen,
  onClose,
}: SpeechBubbleEquipModalProps) {
  return (
    <RetroSideModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold">💭 말풍선</h2>
      <div className="flex flex-col w-full">
        {/* 말풍선 목록 */}
        <div className="flex justify-center w-full min-w-[300px] sm:min-w-[350px] mt-4 h-[320px]">
          <div className="w-full overflow-y-auto pr-1 flex justify-center">
            <Suspense
              fallback={
                <DotLoader
                  loadingText="말풍선을 찾는 중"
                  className="text-lg text-slate-900 mt-4"
                  dotInterval={130}
                />
              }
            >
              <SpeechBubbleList />
            </Suspense>
          </div>
        </div>
      </div>
    </RetroSideModal>
  );
}

const SpeechBubbleList = () => {
  // TODO grade 제거 예정
  const { data: items } = useGetAllOwnedItems("SPEECH_BUBBLE", "NORMAL");
  const queryClient = useQueryClient();
  const { mutate: equip } = useEquipItem();
  const { mutate: unequip } = useUnequipItem();
  const { equippedItems } = useGetEquippedItems();

  const [currentBubble, setCurrentBubble] = useState<string | null>(null);

  useEffect(() => {
    setCurrentBubble(equippedItems?.SPEECH_BUBBLE?.key || null);
  }, [equippedItems]);

  const onEquip = (itemId: string, key: string) => {
    if (key === currentBubble) return;

    setCurrentBubble(key);
    equip(
      { itemId: itemId, slot: "SPEECH_BUBBLE" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [EQUIPPED_ITEMS_QUERY_KEY],
          });
          EventWrapper.emitToGame("changeSpeechBubble", key);
          setCurrentBubble(key);
        },
      }
    );
  };

  const onUnequip = () => {
    unequip("SPEECH_BUBBLE", {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [EQUIPPED_ITEMS_QUERY_KEY],
        });
        setCurrentBubble(null);
        EventWrapper.emitToGame("changeSpeechBubble", "");
      },
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* ✅ 목록 */}
      <div className="flex w-full justify-center">
        {items.length === 0 ? (
          <p className="mt-4">멋진 말풍선을 구매해보아요 💭</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {items.map((bubble) => {
              const isEquipped = bubble.key === currentBubble;

              return (
                <div
                  key={bubble.id}
                  className={`relative p-3 rounded bg-white flex flex-col items-center h-[150px] ${
                    isEquipped
                      ? "border-[#7a5c3d] shadow-inner"
                      : "border-[#bfae96]"
                  }`}
                >
                  {isEquipped && (
                    <span className="absolute top-2 left-2 bg-[#c2a67a] text-white text-sm px-1 rounded shadow-sm z-10 w-5 text-center">
                      E
                    </span>
                  )}

                  <div className="relative w-14 h-14 mb-2">
                    <Image src={bubble.image} fill alt="말풍선" />
                  </div>
                  <p
                    className={`text-sm font-bold text-center ${
                      isEquipped ? "text-[#5e3f2b]" : "text-black"
                    }`}
                  >
                    {bubble.name}
                  </p>
                  <RetroButton
                    className="w-full text-xs mt-2"
                    onClick={() =>
                      isEquipped ? onUnequip() : onEquip(bubble.id, bubble.key)
                    }
                  >
                    {isEquipped ? "해제" : "장착"}
                  </RetroButton>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
