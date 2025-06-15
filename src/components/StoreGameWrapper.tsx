"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ProductOrder } from "@/api/product";
import ProductList from "@/components/store/ProductList";
import dynamic from "next/dynamic";
import { GameRef } from "@/components/Game";
import Image from "next/image";
import RetroButton from "@/components/common/RetroButton";
import { EquippedItem } from "@/types/client/product";
import { useModal } from "@/hook/useModal";
import Alert from "@/utils/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as PRODUCTS_QUERY_KEY } from "@/hook/queries/useGetProducts";
import { QUERY_KEY as GOLD_BALANCE_QUERY_KEY } from "@/hook/queries/useGetGoldBalance";
import { purchase } from "@/api/purchase";
import { useGetGoldBalance } from "@/hook/queries/useGetGoldBalance";
import ConfirmPurchaseModal from "@/components/store/ConfirmPurchaseModal";
import EquippedItemList from "@/components/store/EquippedItemList";
import { EventWrapper } from "@/game/event/EventBus";
import Pawn from "@/components/common/Pawn";
import { SoundManager } from "@/game/managers/sound-manager";
import { CASH } from "@/constants/game/sounds/sfx/sfxs";
import { useGetAllPromotion } from "@/hook/queries/useGetAllPromotions";
import CategorySelector from "@/components/store/CategorySelector";
import PromotionProductList from "@/components/store/PromotionProductList";

const DynamicStoreGame = dynamic(() => import("@/components/StoreGame"), {
  ssr: false,
});

export default function StoreGameWrapper() {
  const [selectedType, setSelectedType] = useState<string>("promotion");

  const [order, setOrder] = useState(ProductOrder.LATEST);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageArr, setPageArr] = useState([1]);

  const { promotions } = useGetAllPromotion();
  const { data: gold } = useGetGoldBalance();
  const [selectedPromotion, setSelectedPromotion] = useState(
    promotions[0].name
  );

  const [equippedItems, setEquippedItems] = useState<EquippedItem[]>([]);
  const [isSceneReady, setIsSceneReady] = useState(false);

  const {
    isModalOpen: isOpen,
    onOpen: onPurchaseModalOpen,
    onClose: onPurchaseModalClose,
  } = useModal();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: purchase,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY, currentPage, order],
      });
      queryClient.invalidateQueries({
        queryKey: [GOLD_BALANCE_QUERY_KEY],
      });
      setEquippedItems([]);
      Alert.done("구매가 완료되었어요!");
      onPurchaseModalClose();
    },
    onError: () => {
      Alert.error("문제가 생겼어요, 잠시후 다시 시도해주세요..");
      onPurchaseModalClose();
    },
  });

  useEffect(() => {
    const handleSceneReady = (data: {
      scene: Phaser.Scene;
      socketNsp?: string;
    }) => {
      if (gameRef.current) {
        gameRef.current.game.canvas.style.opacity = "1";
        gameRef.current.currnetScene = data.scene;

        setIsSceneReady(true);
      }
    };

    EventWrapper.onUiEvent("current-scene-ready", handleSceneReady);

    return () => {
      EventWrapper.offUiEvent("current-scene-ready", handleSceneReady);
    };
  }, []);

  const gameRef = useRef<GameRef | null>(null);

  const onSetPageArr = (productCount: number, limit: number) => {
    const totalPages = Math.floor(productCount / limit);
    const pageArr = Array.from({ length: totalPages }, (_, index) => index + 1);

    setPageArr(pageArr.length === 0 ? [1] : pageArr);
  };

  const openPurchaseModal = () => {
    if (equippedItems.length === 0) {
      Alert.info("상품을 선택해주세요!");
      return;
    }

    onPurchaseModalOpen();
  };

  const onPurchase = () => {
    mutate(
      { productIds: equippedItems.map((i) => i.id) },
      {
        onSuccess: () => {
          SoundManager.getInstance().playSfx(CASH, 1.5);
        },
      }
    );
  };

  const onEquippedItemRemove = useCallback((id: string) => {
    setEquippedItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const onAddEquippedItem = useCallback((item: EquippedItem) => {
    setEquippedItems((prev) => {
      const alreadyExist = prev.some((i) => i.id === item.id);
      if (alreadyExist) return prev;

      return [...prev, item];
    });
  }, []);

  return (
    <div
      className="flex h-screen bg-[#f9f5ec] text-[#2a1f14]"
      style={{ cursor: 'url("/game/ui/cursor.png"), default' }}
    >
      <main className="flex flex-1 overflow-hidden gap-6 overflow-y-auto p-6 justify-center">
        <div className="flex flex-col">
          {/* 카테고리 영역 */}
          <CategorySelector
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />

          {/* 소분류 영역 */}
          <div className="flex items-center justify-between text-xs text-[#5c4b32] font-bold mb-3 px-1">
            {/* 소분류 */}
            <div className="flex gap-2">
              {selectedType === "promotion" ? (
                promotions.map((promotion) => (
                  <button
                    key={promotion.name}
                    className={`px-2 py-1 rounded bg-[#f3e9d0] hover:bg-[#e8ddc3] transition ${
                      selectedPromotion === promotion.name
                        ? "bg-[#f0e4c3] text-[#2a1f14]"
                        : "bg-[#fcf4e4] text-[#5c4b32] hover:bg-[#f3e9d0]"
                    }`}
                    onClick={() => setSelectedPromotion(promotion.name)}
                  >
                    {promotion.name}
                  </button>
                ))
              ) : (
                <button className="px-2 py-1 rounded bg-[#f3e9d0] hover:bg-[#e8ddc3] transition">
                  전체
                </button>
              )}
            </div>

            <div className="flex justify-end mb-3 px-1">
              <div className="relative inline-block text-left">
                {/* 정렬 기준 */}
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value as ProductOrder)}
                  className="block w-40 px-3 py-2 text-sm font-semibold text-[#5c4b32] bg-[#fcf4e4] border border-[#bfae96] rounded shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#d6c6aa]"
                >
                  <option value={ProductOrder.LATEST}>🕒 최신 순</option>
                  <option value={ProductOrder.CHEAPEST}>⬇️ 가격 낮은 순</option>
                  <option value={ProductOrder.PRICIEST}>⬆️ 가격 높은 순</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[#8c7a5c]">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* 상품 영역 */}
          <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
            {selectedType === "promotion" ? (
              <PromotionProductList
                name={selectedPromotion}
                order={order}
                page={currentPage}
                limit={10}
                onAddEquippedItem={onAddEquippedItem}
                onSetPageArr={onSetPageArr}
              />
            ) : (
              <ProductList
                type={selectedType}
                order={order}
                page={currentPage}
                limit={10}
                onAddEquippedItem={onAddEquippedItem}
                onSetPageArr={onSetPageArr}
              />
            )}
          </div>

          <div className="flex justify-center mt-8">
            <nav className="inline-flex items-center space-x-1 bg-[#f3ece1] px-4 py-2 rounded-xl border border-[#d6c6aa] shadow-sm">
              {pageArr.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition ${
                    page === currentPage
                      ? "bg-[#e8e0d0] text-[#2a1f14] font-bold"
                      : "hover:bg-[#f1e8d8] text-[#5c4b32]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-6 items-center pt-[4px]">
          <div className="flex justify-between w-full items-center px-2">
            <div className="flex gap-2 items-center">
              <Image
                src={"/game/ui/gold.png"}
                width={20}
                height={20}
                alt="gold"
              />
              <p className="text-lg font-bold text-[#a27c3f]">
                {gold?.goldBalance.toLocaleString() ?? ""}
              </p>
            </div>
            <RetroButton>BGM</RetroButton>
          </div>

          <div className="overflow-hidden rounded-[8px] border border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] bg-[#fdf8ef]">
            <div className="w-[288px] h-[288px]">
              {!isSceneReady ? (
                <div className="w-full h-full bg-darkBg flex flex-col justify-center items-center">
                  <Pawn
                    animation={"run"}
                    color={"purple"}
                    className="w-[80px] h-[80px]"
                  />
                </div>
              ) : null}
              <DynamicStoreGame
                currentActiveScene={() => {}}
                ref={gameRef}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="w-72 p-3 rounded-[6px] border border-[#d6c6aa] bg-[#fcf4e4] shadow-[3px_3px_0_#c6b89d]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-[#3d2c1b]">
                🎒 장바구니
              </span>
              <div className="flex gap-2">
                <RetroButton variant="ghost" onClick={openPurchaseModal}>
                  모두 구매
                </RetroButton>
                <RetroButton
                  variant="ghost"
                  onClick={() => setEquippedItems([])}
                >
                  모두 삭제
                </RetroButton>
              </div>
            </div>
            <EquippedItemList
              equippedItems={equippedItems}
              onEquippedItemRemove={onEquippedItemRemove}
            />
          </div>
        </div>
      </main>

      <ConfirmPurchaseModal
        isOpen={isOpen}
        onClose={onPurchaseModalClose}
        onPurchase={onPurchase}
        onCharge={() => Alert.warn("준비 중..")}
        equippedItems={equippedItems}
        goldBalance={gold?.goldBalance ?? 0}
      />
    </div>
  );
}
