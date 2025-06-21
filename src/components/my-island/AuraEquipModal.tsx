"use client";

import { Suspense, useEffect, useState } from "react";
import RetroSideModal from "@/components/common/RetroSideModal";
import RetroButton from "@/components/common/RetroButton";
import Image from "next/image";
import { useGetAllOwnedItems } from "@/hook/queries/useGetAllOwnedItems";
import { ItemGrade } from "mmorntype/dist/src/domain/types/item.types";
import { DotLoader } from "@/components/common/DotLoader";
import { EventWrapper } from "@/game/event/EventBus";
import { useEquipItem } from "@/hook/queries/useEquipItem";
import { useUnequipItem } from "@/hook/queries/useUnequipItem";
import { useGetEquippedItems } from "@/hook/queries/useGetEquippedItems";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as EQUIPPED_ITEMS_QUERY_KEY } from "@/hook/queries/useGetEquippedItems";
import { QUERY_KEY as ALL_OWNED_ITEMS_QUERY_KEY } from "@/hook/queries/useGetAllOwnedItems";

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
  const queryClient = useQueryClient();
  const { mutate: equip } = useEquipItem();
  const { mutate: unequip } = useUnequipItem();
  const { equippedItems } = useGetEquippedItems();

  const [currentAura, setCurrentAura] = useState<string | null>(null);

  useEffect(() => {
    setCurrentAura(equippedItems?.AURA?.key || null);
  }, [equippedItems]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      console.log(e.key);
      if (e.key === "aura_updated") {
        queryClient.invalidateQueries({
          queryKey: [ALL_OWNED_ITEMS_QUERY_KEY, "AURA", "NORMAL"],
        });
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const onEquip = (auraId: string, key: string, grade: ItemGrade) => {
    if (key === currentAura) return;

    setCurrentAura(key);
    equip(
      { itemId: auraId, slot: "AURA" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [EQUIPPED_ITEMS_QUERY_KEY],
          });
          EventWrapper.emitToGame("changeAura", key, grade);
          setCurrentAura(key);
        },
      }
    );
  };

  const onUnequip = () => {
    unequip("AURA", {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [EQUIPPED_ITEMS_QUERY_KEY],
        });
        setCurrentAura(null);
        EventWrapper.emitToGame("changeAura", "", "NORMAL");
      },
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* ✅ 오라 목록 */}
      <div className="flex w-full justify-center">
        {items.length === 0 ? (
          <p className="mt-4">멋진 오라를 구매해보아요 ✨</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {items.map((aura) => {
              const isEquipped = aura.key === currentAura;

              return (
                <div
                  key={aura.id}
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
                    <Image src={aura.image} fill alt="오라" sizes="56px" />
                  </div>
                  <p
                    className={`text-sm font-bold text-center ${
                      isEquipped ? "text-[#5e3f2b]" : "text-black"
                    }`}
                  >
                    {aura.name}
                  </p>
                  <RetroButton
                    className="w-full text-xs mt-2"
                    onClick={() =>
                      isEquipped
                        ? onUnequip()
                        : onEquip(aura.id, aura.key, aura.grade)
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
