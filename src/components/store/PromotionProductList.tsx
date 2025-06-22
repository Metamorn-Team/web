"use client";

import { ProductOrder } from "@/api/product";
import ProductCardSkeleton from "@/components/store/ProductCardSkeleton";
import { useGetPromotionProducts } from "@/hook/queries/useGetPromotionProducts";
import { EquippedItem } from "@/types/client/product";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";

const DynamicProductCard = dynamic(
  () => import("@/components/store/ProductCard"),
  {
    ssr: false,
    loading: () => <ProductCardSkeleton />,
  }
);

interface PromotionProductListProps {
  name: string;
  order: ProductOrder;
  page: number;
  limit: number;
  onAddEquippedItem: (item: EquippedItem) => void;
  onSetPageArr: (productCount: number, limit: number) => void;
}

const PromotionProductList = ({
  name,
  order,
  page,
  limit,
  onAddEquippedItem,
  onSetPageArr,
}: PromotionProductListProps) => {
  const { data, isLoading } = useGetPromotionProducts({
    name,
    order,
    limit,
    page,
  });

  useEffect(() => {
    const productCount = data?.count;

    if (productCount) {
      onSetPageArr(productCount, limit);
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
      {isLoading
        ? Array.from({ length: limit }).map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))
        : data &&
          data.products.map((product, index) => (
            <DynamicProductCard
              key={product.id}
              product={product}
              onAddEquippedItem={onAddEquippedItem}
              className="h-full"
              priority={index === 0}
            />
          ))}
    </div>
  );
};

export default PromotionProductList;
