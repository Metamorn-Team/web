"use client";

import { Suspense, useState } from "react";
import RetroSideModal from "@/components/common/RetroSideModal";
import RetroButton from "@/components/common/RetroButton";
import Image from "next/image";
import { useGetAllOwnedItems } from "@/hook/queries/useGetAllOwnedItems";
import { DotLoader } from "@/components/common/DotLoader";
import { EventWrapper } from "@/game/event/EventBus";
import { useEquipItem } from "@/hook/queries/useEquipItem";
import { useUnequipItem } from "@/hook/queries/useUnequipItem";

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
  const { mutate: equip } = useEquipItem();
  const { mutate: unequip } = useUnequipItem();

  const [currentAura, setCurrentAura] = useState("");

  const onEquip = (auraId: string, key: string) => {
    if (auraId === currentAura) return;

    setCurrentAura(auraId);
    equip(
      { itemId: auraId, slot: "SPEECH_BUBBLE" },
      {
        onSuccess: () => {
          EventWrapper.emitToGame("changeSpeechBubble", key);
        },
      }
    );
  };

  const onUnequip = () => {
    unequip("SPEECH_BUBBLE", {
      onSuccess: () => {
        setCurrentAura("");
        EventWrapper.emitToGame("changeSpeechBubble", "");
      },
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* ✅ 해제 버튼 고정 */}
      <div className="w-full flex justify-end mb-2 px-1">
        <RetroButton variant="ghost" className="text-xs" onClick={onUnequip}>
          말풍선 해제
        </RetroButton>
      </div>

      {/* ✅ 목록 */}
      <div className="flex w-full justify-center">
        {items.length === 0 ? (
          <p className="mt-4">멋진 말풍선을 구매해보아요 💭</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {items.map((bubble) => (
              <div
                key={bubble.id}
                className="border border-[#bfae96] p-3 rounded bg-white flex flex-col items-center h-[150px]"
              >
                <div className="relative w-14 h-14 mb-2">
                  <Image src={bubble.image} fill alt="말풍선" />
                </div>
                <p className="text-sm font-bold text-center">{bubble.name}</p>
                <RetroButton
                  className="w-full text-xs mt-2"
                  onClick={() => onEquip(bubble.id, bubble.key)}
                >
                  장착
                </RetroButton>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
