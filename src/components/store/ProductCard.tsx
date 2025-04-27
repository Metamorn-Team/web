"use client";

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
  const onTry = () => {
    EventWrapper.emitToGame("tryOnProduct", product.type, product.key);

    const { id, name, price } = product;
    onAddEquippedItem({ id, name, price });
  };

  return (
    <div
      key={product.id}
      className="bg-[#fdf8ef] border border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] transition p-4 flex flex-col justify-between gap-2 w-52 rounded-[6px]"
      style={{ aspectRatio: "1/1.3", fontFamily: "'DungGeunMo', sans-serif" }}
    >
      <div className="relative w-full aspect-square overflow-hidden border border-[#d2c4ad] rounded-[4px]">
        <div
          className={`absolute top-1 left-1 text-xs text-white px-2 py-1 rounded-[4px] flex justify-center items-center ${
            gradeStyles[product.grade].style
          }`}
        >
          {gradeStyles[product.grade].label}
        </div>

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
          <button
            className="px-2 py-1 text-[11px] bg-[#b4a68b] text-white border border-[#5c4b32] rounded-[2px] shadow-[2px_2px_0_#5c4b32] hover:bg-[#a79b84] transition-all"
            onClick={onTry}
          >
            장착
          </button>
          <button className="px-2 py-1 text-[11px] bg-[#b4a68b] text-white border border-[#5c4b32] rounded-[2px] shadow-[2px_2px_0_#5c4b32] hover:bg-[#a79b84] transition-all">
            구매
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
