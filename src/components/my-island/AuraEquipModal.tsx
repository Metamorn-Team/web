"use client";

import { Suspense, useState } from "react";
import RetroSideModal from "@/components/common/RetroSideModal";
import RetroButton from "@/components/common/RetroButton";
import Image from "next/image";
import { useGetAllOwnedItems } from "@/hook/queries/useGetAllOwnedItems";
import { ItemGrade } from "mmorntype/dist/src/domain/types/item.types";
import { DotLoader } from "@/components/common/DotLoader";
import { EventWrapper } from "@/game/event/EventBus";
import { useEquipItem } from "@/hook/queries/useEquipItem";
import { useUnequipItem } from "@/hook/queries/useUnequipItem";

interface AuraEquipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuraEquipModal({
  isOpen,
  onClose,
}: AuraEquipModalProps) {
  return (
    <RetroSideModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold">✨ 오라</h2>
      <div className="flex flex-col w-full">
        {/* 오라 목록 */}
        <div className="flex justify-center w-full min-w-[300px] sm:min-w-[350px] mt-4 h-[320px]">
          <div className="w-full overflow-y-auto pr-1 flex justify-center">
            <Suspense
              fallback={
                <DotLoader
                  loadingText="오라를 찾는 중"
                  className="text-lg text-slate-900 mt-4"
                  dotInterval={130}
                />
              }
            >
              <AuraList />
            </Suspense>
          </div>
        </div>
      </div>
    </RetroSideModal>
  );
}

const AuraList = () => {
  // TODO grade 제거
  const { data: items } = useGetAllOwnedItems("AURA", "NORMAL");
  const { mutate: equip } = useEquipItem();
  const { mutate: unequip } = useUnequipItem();

  const [currentAura, setCurrentAura] = useState("");

  const onEquip = (auraId: string, key: string, grade: ItemGrade) => {
    if (auraId === currentAura) return;

    setCurrentAura(auraId);
    equip(
      { itemId: auraId, slot: "AURA" },
      {
        onSuccess: () => {
          EventWrapper.emitToGame("changeAura", key, grade);
        },
      }
    );
  };

  const onUnequip = () => {
    unequip("AURA", {
      onSuccess: () => {
        EventWrapper.emitToGame("changeAura", "", "NORMAL");
      },
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* ✅ 해제 버튼 */}
      <div className="w-full flex justify-end mb-2 px-1">
        <RetroButton variant="ghost" className="text-xs" onClick={onUnequip}>
          오라 해제
        </RetroButton>
      </div>

      {/* ✅ 오라 목록 */}
      <div className="flex w-full justify-center">
        {items.length === 0 ? (
          <p className="mt-4">멋진 오라를 구매해보아요 ✨</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {items.map((aura) => (
              <div
                key={aura.id}
                className="border border-[#bfae96] p-3 rounded bg-white flex flex-col items-center h-[150px]"
              >
                <div className="relative w-14 h-14 mb-2">
                  <Image src={aura.image} fill alt="오라" />
                </div>
                <p className="text-sm font-bold text-center">{aura.name}</p>
                <RetroButton
                  className="w-full text-xs mt-2"
                  onClick={() => onEquip(aura.id, aura.key, aura.grade)}
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
