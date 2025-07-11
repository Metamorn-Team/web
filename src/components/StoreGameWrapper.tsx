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
import { QUERY_KEY as PROMOTION_PRODUCTS_QUERY_KEY } from "@/hook/queries/useGetPromotionProducts";
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
import { useIsMobile } from "@/hook/useIsMobile";
import { FiShoppingCart } from "react-icons/fi";
import { persistItem } from "@/utils/persistence";
import Footer from "@/components/common/Footer";
import GoldChargeModal from "@/components/GoldChargeModal";
import LoginModal from "@/components/login/LoginModal";

const DynamicStoreGame = dynamic(() => import("@/components/StoreGame"), {
  ssr: false,
});

interface StoreGameWrapperProps {
  isLogined: boolean;
}

export default function StoreGameWrapper({ isLogined }: StoreGameWrapperProps) {
  const isMobile = useIsMobile();
  const [selectedType, setSelectedType] = useState<string>("promotion");

  const [promotionPage, setPromotionPage] = useState(1);
  const [normalPage, setNormalPage] = useState(1);
  const [promotionOrder, setPromotionOrder] = useState(ProductOrder.LATEST);
  const [normalOrder, setNormalOrder] = useState(ProductOrder.LATEST);
  const [pageArr, setPageArr] = useState([1]);

  const currentPage = selectedType === "promotion" ? promotionPage : normalPage;
  const order = selectedType === "promotion" ? promotionOrder : normalOrder;

  const setCurrentPage = (page: number) => {
    if (selectedType === "promotion") {
      setPromotionPage(page);
    } else {
      setNormalPage(page);
    }
  };

  const setOrder = (order: ProductOrder) => {
    if (selectedType === "promotion") {
      setPromotionOrder(order);
    } else {
      setNormalOrder(order);
    }
  };

  // 로그인한 경우에만 API 호출
  const { promotions } = useGetAllPromotion({ enabled: isLogined });
  const { data: gold } = useGetGoldBalance({ enabled: isLogined });

  const [selectedPromotion, setSelectedPromotion] = useState(
    promotions?.[0]?.name || ""
  );

  const [equippedItems, setEquippedItems] = useState<EquippedItem[]>([]);
  const [isSceneReady, setIsSceneReady] = useState(false);

  const {
    isModalOpen: isOpen,
    onOpen: onPurchaseModalOpen,
    onClose: onPurchaseModalClose,
  } = useModal();

  const {
    isModalOpen: isGoldChargeModalOpen,
    onOpen: onGoldChargeModalOpen,
    onClose: onGoldChargeModalClose,
  } = useModal();

  const {
    isModalOpen: isLoginModalOpen,
    onOpen: onLoginModalOpen,
    onClose: onLoginModalClose,
  } = useModal();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: purchase,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          PROMOTION_PRODUCTS_QUERY_KEY,
          promotionPage,
          promotionOrder,
          selectedPromotion,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY, normalPage, normalOrder],
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

  useEffect(() => {
    if (promotions && promotions.length > 0) {
      setSelectedPromotion(promotions[0].name);
    }
  }, [promotions]);

  const gameRef = useRef<GameRef | null>(null);

  const onSetPageArr = (productCount: number, limit: number) => {
    const totalPages = Math.floor(productCount / limit);
    const pageArr = Array.from({ length: totalPages }, (_, index) => index + 1);
    setPageArr(pageArr.length === 0 ? [1] : pageArr);
  };

  const openPurchaseModal = () => {
    if (!isLogined) {
      onLoginModalOpen();
      return;
    }

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
          setIsCartVisible(false);
          persistItem("aura_updated", Date.now().toString());
          persistItem("bubble_updated", Date.now().toString());
        },
      }
    );
  };

  const onEquippedItemRemove = useCallback((id: string) => {
    setEquippedItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const onAddEquippedItem = useCallback(
    (item: EquippedItem) => {
      if (!isLogined) {
        onLoginModalOpen();
        return;
      }

      setEquippedItems((prev) => {
        const alreadyExist = prev.some((i) => i.id === item.id);
        return alreadyExist ? prev : [...prev, item];
      });
    },
    [isLogined, onLoginModalOpen]
  );

  const [isCartVisible, setIsCartVisible] = useState(false);

  function renderGoldInfo(gold?: number) {
    if (!isLogined) {
      return (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#5c4b32]">로그인 후 이용해주세요</span>
        </div>
      );
    }

    return (
      <div className="flex gap-2 items-center">
        <Image src="/game/ui/gold.png" width={20} height={20} alt="gold" />
        <p className="text-lg font-bold text-[#a27c3f]">
          {gold?.toLocaleString() ?? ""}
        </p>
        <button
          onClick={onGoldChargeModalOpen}
          className="ml-1 px-2 py-0.5 text-xs font-semibold rounded bg-[#f3e9d0] border border-[#d6c6aa] text-[#5c4b32] hover:bg-[#e8ddc3] transition"
        >
          충전
        </button>
      </div>
    );
  }

  const renderCart = (onPurchase: () => void) => (
    <div className="w-72 p-3 rounded-[6px] border border-[#d6c6aa] bg-[#fcf4e4] shadow-[3px_3px_0_#c6b89d]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-[#3d2c1b]">🎒 장바구니</span>
        <div className="flex gap-2">
          <RetroButton variant="ghost" onClick={onPurchase}>
            {isLogined ? "모두 구매" : "로그인 후 구매"}
          </RetroButton>
          <RetroButton variant="ghost" onClick={() => setEquippedItems([])}>
            모두 삭제
          </RetroButton>
          {isMobile && (
            <RetroButton
              variant="ghost"
              onClick={() => setIsCartVisible(false)}
            >
              닫기
            </RetroButton>
          )}
        </div>
      </div>
      <EquippedItemList
        equippedItems={equippedItems}
        onEquippedItemRemove={onEquippedItemRemove}
      />
    </div>
  );

  // 로그인하지 않은 사용자를 위한 UI
  if (!isLogined) {
    return (
      <div className="flex flex-col h-dvh bg-[#f9f5ec] text-[#2a1f14]">
        <main className="flex flex-1 gap-6 p-6 justify-center items-center">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-[#5c4b32]">
                🎁 리아 상점
              </h1>
              <p className="text-lg text-[#7a6144]">
                로그인하고 귀여운 아이템들을 만나보세요!
              </p>
            </div>

            <div className="flex justify-center">
              <Pawn color="orange" animation="idle" className="w-20 h-20" />
            </div>

            <RetroButton
              onClick={onLoginModalOpen}
              className="text-lg px-6 py-3"
            >
              로그인하기
            </RetroButton>
          </div>
        </main>

        <LoginModal isOpen={isLoginModalOpen} onClose={onLoginModalClose} />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-dvh bg-[#f9f5ec] text-[#2a1f14]"
      style={{ cursor: 'url("/game/ui/cursor.png"), default' }}
    >
      {/* 모바일 헤더 */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-10 bg-[#f9f5ec] border-b border-[#d6c6aa] px-4 py-2 flex justify-between items-center shadow-md">
          <div className="text-sm font-bold text-[#3d2c1b]">🎁 리아 상점</div>
          <div className="flex items-center gap-3">
            {renderGoldInfo(gold?.goldBalance)}
            <button
              onClick={() => setIsCartVisible(true)}
              className="relative"
              aria-label="장바구니 열기"
            >
              <FiShoppingCart className="w-6 h-6 text-[#5c4b32]" />
              {equippedItems.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full">
                  {equippedItems.length}
                </span>
              )}
            </button>
          </div>
        </header>
      )}

      {/* 모바일 장바구니 모달 */}
      {isMobile && isCartVisible && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-end p-4 z-50">
          {renderCart(openPurchaseModal)}
        </div>
      )}

      <main className="flex flex-1 overflow-hidden gap-6 overflow-y-auto p-4 sm:p-6 justify-center">
        <div className={`flex flex-col ${isMobile ? "w-screen" : ""}`}>
          <CategorySelector
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            className={isMobile ? "mt-[40px]" : ""}
          />
          <div className="flex items-start justify-between text-xs text-[#5c4b32] font-bold px-2 sm:py-4">
            <div className="flex gap-2">
              {selectedType === "promotion" ? (
                promotions?.map((promotion) => (
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
              <div className="relative inline-block text-left w-24">
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value as ProductOrder)}
                  className="block w-full pl-2 pr-6 py-1.5 text-xs font-semibold text-[#5c4b32] bg-[#fcf4e4] border border-[#bfae96] rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#d6c6aa]"
                >
                  <option value={ProductOrder.LATEST}>최신</option>
                  <option value={ProductOrder.CHEAPEST}>저가순</option>
                  <option value={ProductOrder.PRICIEST}>고가순</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[#8c7a5c] text-xs">
                  ▼
                </div>
              </div>
            </div>
          </div>
          {/* 상품 목록 */}
          <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide gap-2">
            <div className="flex-1 mr-1">
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
            <div className="flex justify-center mt-2">
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

            <Footer />
          </div>
        </div>
        {/* 우측 영역 */}
        <div
          className={`flex flex-col gap-6 items-center pt-[4px] ${
            isMobile ? "hidden" : ""
          }`}
        >
          {/* 골드 및 브금 버튼 */}
          <div className="flex justify-between w-full items-center px-2">
            {renderGoldInfo(gold?.goldBalance)}
            <RetroButton>BGM</RetroButton>
          </div>
          {/* 미리보기 씬 영역 */}
          <div className="overflow-hidden rounded-[8px] border border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] bg-[#fdf8ef]">
            <div className="w-[288px] h-[288px]">
              {!isSceneReady ? (
                <div className="w-full h-full bg-darkBg flex flex-col justify-center items-center">
                  <Pawn
                    animation="run"
                    color="purple"
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

          {/* 장바구니 */}
          <div className="w-72">{renderCart(openPurchaseModal)}</div>
        </div>
      </main>
      <ConfirmPurchaseModal
        isOpen={isOpen}
        onClose={onPurchaseModalClose}
        onPurchase={onPurchase}
        onCharge={onGoldChargeModalOpen}
        equippedItems={equippedItems}
        goldBalance={gold?.goldBalance ?? 0}
      />
      <GoldChargeModal
        isOpen={isGoldChargeModalOpen}
        onClose={onGoldChargeModalClose}
        currentGold={gold?.goldBalance ?? 0}
      />
      <LoginModal isOpen={isLoginModalOpen} onClose={onLoginModalClose} />
    </div>
  );
}
