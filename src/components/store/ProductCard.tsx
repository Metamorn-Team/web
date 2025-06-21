"use client";

import RetroButton from "@/components/common/RetroButton";
import { EventWrapper } from "@/game/event/EventBus";
import { useIsMobile } from "@/hook/useIsMobile";
import { EquippedItem, Product } from "@/types/client/product";
import Image from "next/image";
import React from "react";

interface ProductCardProps {
  product: Product;
  onAddEquippedItem: (item: EquippedItem) => void;
  className?: string;
  priority?: boolean;
}

// const gradeStyles = {
//   NORMAL: {
//     label: "일반",
//     style: "bg-gray-400 shadow-md",
//   },
//   RARE: {
//     label: "레어",
//     style: "bg-gradient-to-r from-blue-500 to-blue-700 shadow-glow",
//   },
//   UNIQUE: {
//     label: "유니크",
//     style: "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-glow",
//   },
//   EPIC: {
//     label: "에픽",
//     style: "bg-gradient-to-r from-purple-600 to-purple-800 shadow-glow",
//   },
// };

const ProductCard = ({
  product,
  onAddEquippedItem,
  className,
  priority = false,
}: ProductCardProps) => {
  const isMobile = useIsMobile();

  const onEquip = () => {
    EventWrapper.emitToGame("tryOnProduct", product.type, product.key);
  };

  return (
    <div
      key={product.id}
      className={`bg-[#fdf8ef] border border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] transition p-4 flex flex-col justify-between gap-2 w-52 rounded-[6px] ${
        product.purchasedStatus === "PURCHASED" ? "opacity-70" : "opacity-100"
      } ${className}`}
    >
      <div className="relative w-full aspect-square overflow-hidden border border-[#d2c4ad] rounded-[4px]">
        {/* 등급 뱃지 (좌측 상단) */}
        {/* <div
          className={`absolute top-1 left-1 text-xs text-white px-2 py-1 rounded-[4px] z-10 ${
            gradeStyles[product.grade].style
          }`}
        >
          {gradeStyles[product.grade].label}
        </div> */}

        {/* 프로모션 이름 뱃지 (우측 상단) */}
        {product.promotionName && (
          <div className="absolute top-1 right-1 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-[4px] z-10">
            {product.promotionName}
          </div>
        )}

        {/* SOLD OUT 라벨 */}
        {product.purchasedStatus === "PURCHASED" && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-red-600 font-bold text-center z-50">
            SOLD OUT
          </div>
        )}

        {/* 이미지 */}
        <Image
          src={product.coverImage}
          alt={product.name}
          fill
          sizes="280px"
          priority={priority}
        />
      </div>

      <div>
        <div className="text-base font-bold text-[#3d2c1b]">{product.name}</div>
        <div className="text-xs text-[#5c4b32] leading-snug mt-1">
          {product.description}
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        {/* 가격 영역 */}
        {product.saledPrice !== null && product.discountRate != null ? (
          <div className="flex flex-col items-start">
            <div className="line-through text-sm text-[#a39b85]">
              {product.originPrice.toLocaleString()}G
            </div>
            <div className="text-[#d82c2c] font-bold text-lg">
              {product.saledPrice.toLocaleString()}G
            </div>
            <div className="text-xs text-[#d82c2c] font-semibold">
              ({Math.floor(product.discountRate * 100)}% 할인)
            </div>
          </div>
        ) : (
          <span className="flex gap-2 items-center">
            <Image
              src={"/game/ui/gold.png"}
              width={20}
              height={20}
              alt="gold"
            />
            <p className="text-[#40381b] font-bold text-base">
              {product.originPrice.toLocaleString()}
            </p>
          </span>
        )}

        {/* 버튼 영역 */}
        <div className="h-full flex flex-col justify-end">
          <div className="flex gap-1">
            {!isMobile && <RetroButton onClick={onEquip}>장착</RetroButton>}
            <RetroButton
              disabled={product.purchasedStatus === "PURCHASED"}
              onClick={() =>
                product.purchasedStatus !== "PURCHASED"
                  ? onAddEquippedItem({
                      id: product.id,
                      name: product.name,
                      price:
                        // 가격은 0원일 수 있기 때문에 null로 비교
                        product.saledPrice !== null
                          ? product.saledPrice
                          : product.originPrice,
                    })
                  : () => {}
              }
            >
              담기
            </RetroButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
