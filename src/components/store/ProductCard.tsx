"use client";

import RetroButton from "@/components/common/RetroButton";
import { EventWrapper } from "@/game/event/EventBus";
import { EquippedItem, Product } from "@/types/client/product";
import Image from "next/image";
import React from "react";

interface ProductCardProps {
  product: Product;
  onAddEquippedItem: (item: EquippedItem) => void;
}

const gradeStyles = {
  NORMAL: {
    label: "일반",
    style: "bg-gray-400 shadow-md",
  },
  RARE: {
    label: "레어",
    style: "bg-gradient-to-r from-blue-500 to-blue-700 shadow-glow",
  },
  UNIQUE: {
    label: "유니크",
    style: "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-glow",
  },
  EPIC: {
    label: "에픽",
    style: "bg-gradient-to-r from-purple-600 to-purple-800 shadow-glow",
  },
};

const ProductCard = ({ product, onAddEquippedItem }: ProductCardProps) => {
  const onEquip = () => {
    EventWrapper.emitToGame("tryOnProduct", product.type, product.key);
  };

  return (
    <div
      key={product.id}
      className={`bg-[#fdf8ef] border border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] transition p-4 flex flex-col justify-between gap-2 w-52 rounded-[6px] ${
        product.purchasedStatus === "PURCHASED" ? "opacity-70" : "opacity-100"
      }`}
    >
      <div className="relative w-full aspect-square overflow-hidden border border-[#d2c4ad] rounded-[4px]">
        <div
          className={`absolute top-1 left-1 text-xs text-white px-2 py-1 rounded-[4px] flex justify-center items-center ${
            gradeStyles[product.grade].style
          }`}
        >
          {gradeStyles[product.grade].label}
        </div>

        {/* 솔드아웃 텍스트 (카드 전체 중앙에 대각선으로 표시) */}
        {product.purchasedStatus === "PURCHASED" && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-red-600 font-bold text-center">
            SOLD OUT
          </div>
        )}
        <img
          src={product.coverImage}
          alt={product.name}
          className="w-full h-full object-contain image-render-pixel"
        />
      </div>

      <div>
        <div className="text-base font-bold text-[#3d2c1b]">{product.name}</div>
        <div className="text-xs text-[#5c4b32] leading-snug mt-1">
          {product.description}
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <span className="flex gap-2 items-center">
          <Image src={"/game/ui/gold.png"} width={20} height={20} alt="gold" />
          <p className="text-[#40381b] font-bold text-base">
            {product.price.toLocaleString()}
          </p>
        </span>

        <div className="flex gap-1">
          <RetroButton
            onClick={
              product.purchasedStatus !== "PURCHASED" ? onEquip : () => {}
            }
            disabled={product.purchasedStatus === "PURCHASED"}
          >
            창작
          </RetroButton>
          <RetroButton
            disabled={product.purchasedStatus === "PURCHASED"}
            onClick={() =>
              product.purchasedStatus !== "PURCHASED"
                ? onAddEquippedItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                  })
                : () => {}
            }
          >
            담기
          </RetroButton>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
