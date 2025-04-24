"use client";

import { EventWrapper } from "@/game/event/EventBus";
import { Product } from "@/types/client/friend.types";
import Image from "next/image";
import React from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const onTry = () => {
    EventWrapper.emitToGame("tryOnProduct", product.type, product.key);
  };

  return (
    <div
      key={product.id}
      className="bg-[#fdf8ef] border border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] transition p-4 flex flex-col justify-between gap-2 w-56 rounded-[6px]"
      style={{ aspectRatio: "1/1.3", fontFamily: "'DungGeunMo', sans-serif" }}
    >
      <div className="relative h-48 w-48 overflow-hidden border border-[#d2c4ad] rounded-[4px]">
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
          <p className="text-[#40381b] font-bold text-base">{product.price}</p>
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
