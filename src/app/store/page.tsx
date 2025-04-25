"use client";

import React, { useCallback, useRef, useState } from "react";
import { FiZap } from "react-icons/fi";
import { ProductType, ProductOrder } from "@/api/product";
import ProductList from "@/components/store/ProductList";
import dynamic from "next/dynamic";
import { GameRef } from "@/components/Game";
import Image from "next/image";
import RetroButton from "@/components/common/RetroButton";
import { EquippedItem } from "@/types/client/product";
import RetroModal from "@/components/common/RetroModal";
import { useModal } from "@/hook/useModal";
import Alert from "@/utils/alert";

const DynamicStoreGame = dynamic(() => import("@/components/StoreGame"), {
  ssr: false,
});

const categories = [
  { value: ProductType.AURA, icon: <FiZap />, label: "오라" },
];

export default function StorePage() {
  const [selectedType, setSelectedType] = useState(ProductType.AURA);
  const [order, setOrder] = useState(ProductOrder.LATEST);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageArr, setPageArr] = useState([1]);

  const [equippedItems, setEquippedItems] = useState<EquippedItem[]>([]);

  const { isModalOpen: isOpen, onOpen, onClose } = useModal();

  const gameRef = useRef<GameRef | null>(null);

  const onSetPageArr = (productCount: number, limit: number) => {
    const totalPages = Math.floor(productCount / limit);
    const pageArr = Array.from({ length: totalPages }, (_, index) => index + 1);

    setPageArr(pageArr.length === 0 ? [1] : pageArr);
  };

  const onPurchaseAll = () => {
    if (equippedItems.length === 0) {
      Alert.info("상품을 선택해주세요!");
      return;
    }

    onOpen();
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
        {/* 왼쪽: 상품 카테고리 + 리스트 + 페이지네이션 */}
        <div className="flex flex-col">
          {/* 카테고리 탭 */}
          <div className="flex gap-3 mb-4 sticky top-0 z-50 bg-[#f9f5ec]">
            {categories.map((category) => (
              <RetroButton
                key={category.value}
                variant="ghost"
                onClick={() => setSelectedType(category.value)}
                className={`flex items-center gap-2 px-4 py-2 border border-[#bfae96] text-sm font-bold shadow-[3px_3px_0_#8c7a5c] transition-all rounded-[4px]
          ${
            selectedType === category.value
              ? "bg-[#f0e4c3] text-[#2a1f14]"
              : "bg-[#fcf4e4] text-[#5c4b32] hover:bg-[#f3e9d0]"
          }`}
                // style={{ fontFamily: "'DungGeunMo', sans-serif" }}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.label}</span>
              </RetroButton>
            ))}
          </div>

          {/* 정렬 메뉴 (카테고리 바로 아래) */}
          <div className="flex items-center justify-between text-xs text-[#5c4b32] font-bold mb-3 px-1">
            {/* 서브 카테고리 (필요 시 추가 가능) */}
            <div className="flex gap-2">
              {/* 예시: 오라 타입 필터 */}
              <button className="px-2 py-1 rounded bg-[#f3e9d0] hover:bg-[#e8ddc3] transition">
                전체
              </button>
            </div>

            {/* 정렬 옵션 */}
            {/* 정렬 드롭다운 */}
            <div className="flex justify-end mb-3 px-1">
              <div className="relative inline-block text-left">
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value as ProductOrder)}
                  className="block w-40 px-3 py-2 text-sm font-semibold text-[#5c4b32] bg-[#fcf4e4] border border-[#bfae96] rounded shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#d6c6aa]"
                  style={{ fontFamily: "'DungGeunMo', sans-serif" }}
                >
                  <option value={ProductOrder.LATEST}>🕒 최신 순</option>
                  <option value={ProductOrder.CHEAPEST}>⬇️ 가격 낮은 순</option>
                  <option value={ProductOrder.PRICIEST}>⬆️ 가격 높은 순</option>
                </select>
                {/* 아래 화살표 아이콘 */}
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[#8c7a5c]">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* 상품 리스트 */}
          <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
            <ProductList
              type={selectedType}
              order={order}
              page={currentPage}
              limit={10}
              onAddEquippedItem={onAddEquippedItem}
              onSetPageArr={onSetPageArr}
            />
          </div>

          {/* 페이지네이션 */}
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

        {/* 오른쪽: 미리보기 + 장착 정보 */}
        <div className="flex flex-col gap-6 items-center pt-[4px]">
          {/* 골드 + 음소거 */}
          <div className="flex justify-between w-full items-center px-2">
            <div className="flex gap-2 items-center">
              <Image
                src={"/game/ui/gold.png"}
                width={20}
                height={20}
                alt="gold"
              />
              <p
                className="text-lg font-bold text-[#a27c3f]"
                style={{ fontFamily: "'DungGeunMo', sans-serif" }}
              >
                1,234
              </p>
            </div>
            <RetroButton>BGM</RetroButton>
          </div>

          {/* 게임 미리보기 */}
          <div className="overflow-hidden rounded-[8px] border border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] bg-[#fdf8ef]">
            <DynamicStoreGame currentActiveScene={() => {}} ref={gameRef} />
          </div>

          {/* 장착 중 아이템 */}
          <div
            className="w-72 p-3 rounded-[6px] border border-[#d6c6aa] bg-[#fcf4e4] shadow-[3px_3px_0_#c6b89d]"
            style={{ fontFamily: "'DungGeunMo', sans-serif" }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-[#3d2c1b]">
                🎒 장착 내역
              </span>
              <div className="flex gap-2">
                <RetroButton variant="ghost" onClick={onPurchaseAll}>
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
            <ul className="text-xs text-[#5c4b32] leading-snug space-y-1">
              {equippedItems.length === 0 ? (
                <p>마음껏 장착해봐요!</p>
              ) : (
                equippedItems.map((item) => (
                  <HistoryItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    onRemove={() => onEquippedItemRemove(item.id)}
                  />
                ))
              )}
            </ul>
          </div>
        </div>
      </main>

      <RetroModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {}}
        title="구매 확인"
        confirmText="구매"
        cancelText="취소"
      >
        <div className="space-y-4">
          <ul className="space-y-2 text-sm text-[#5c4b32]">
            {equippedItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-[#f3e9d0] p-2 rounded-lg shadow-md hover:bg-[#f1e0c2] transition-all"
              >
                <p className="text-base">{item.name}</p>
                <p className="font-semibold text-base">
                  {item.price.toLocaleString()} G
                </p>
              </li>
            ))}
          </ul>
          <div className="text-center text-lg font-bold text-[#a27c3f]">
            <p>
              총{" "}
              {equippedItems
                .reduce((total, item) => total + item.price, 0)
                .toLocaleString()}{" "}
              G
            </p>
          </div>
        </div>
      </RetroModal>
    </div>
  );
}

interface HistoryItemProps {
  id: string;
  name: string;
  price: number;
  onRemove?: (id: string) => void;
}

const HistoryItem = ({ id, name, price, onRemove }: HistoryItemProps) => {
  return (
    <li className="flex justify-between items-center px-3 py-2 bg-[#f5eee0] border border-[#d6c6aa] rounded-[4px] shadow-[2px_2px_0_#c6b89d]">
      <div className="flex flex-col text-xs text-[#4a3928] font-bold leading-snug">
        <span className="">{name}</span>
        <span className="text-[#a27c3f]">{price.toLocaleString()} G</span>
      </div>
      <RetroButton
        onClick={() => onRemove?.(id)}
        className="ml-2 px-[6px] py-[2px] text-[10px]"
        variant="ghost"
      >
        ✕
      </RetroButton>
    </li>
  );
};
