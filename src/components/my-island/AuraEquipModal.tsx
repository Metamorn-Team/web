"use client";

import { Suspense, useState } from "react";
import RetroSideModal from "@/components/common/RetroSideModal";
import RetroButton from "@/components/common/RetroButton";
import classNames from "classnames";
import Image from "next/image";
import { useGetAllOwnedItems } from "@/hook/queries/useGetAllOwnedItems";
import { ItemGrade } from "mmorntype/dist/src/domain/types/item.types";
import { DotLoader } from "@/components/common/DotLoader";
import { ITEM_GRADE, ITEM_GRADE_KR } from "@/constants/item";
import { EventWrapper } from "@/game/event/EventBus";
import { useEquipItem } from "@/hook/queries/useEquipItem";

interface AuraEquipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuraEquipModal({
  isOpen,
  onClose,
}: AuraEquipModalProps) {
  const [selectedTier, setSelectedTier] = useState<ItemGrade>("NORMAL");

  return (
    <RetroSideModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">🌀 오라 장착</h2>
      <div className="flex flex-col w-full">
        {/* 좌측 등급 메뉴 */}
        <div className="flex flex-row gap-2 border-[#bfae96]">
          {ITEM_GRADE.map((tier, i) => (
            <button
              key={tier}
              className={classNames(
                "px-3 py-1 text-sm rounded border border-[#8c7a5c]",
                selectedTier === tier
                  ? "bg-yellow-200 font-bold shadow-inner"
                  : "bg-[#fdf8ef] hover:bg-yellow-100"
              )}
              onClick={() => setSelectedTier(tier)}
            >
              {ITEM_GRADE_KR[i]}
            </button>
          ))}
        </div>

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
              <AuraList grade={selectedTier} />
            </Suspense>
          </div>
        </div>
      </div>
    </RetroSideModal>
  );
}

const AuraList = ({ grade }: { grade: ItemGrade }) => {
  const { data: items } = useGetAllOwnedItems("AURA", grade);
  const { mutate: equip } = useEquipItem();
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

  return (
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
  );
};
