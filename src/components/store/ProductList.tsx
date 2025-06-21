"use client";

import { ProductOrder } from "@/api/product";
import ProductCardSkeleton from "@/components/store/ProductCardSkeleton";
import { useGetProducts } from "@/hook/queries/useGetProducts";
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

interface ProductListProps {
  type: string;
  order: ProductOrder;
  page: number;
  limit: number;
  onAddEquippedItem: (item: EquippedItem) => void;
  onSetPageArr: (productCount: number, limit: number) => void;
}

const ProductList = ({
  type,
  order,
  page,
  limit,
  onAddEquippedItem,
  onSetPageArr,
}: ProductListProps) => {
  const { data, isLoading } = useGetProducts({
    type,
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
          data.products.map((product) => (
            <DynamicProductCard
              key={product.id}
              product={product}
              onAddEquippedItem={onAddEquippedItem}
              className="h-full"
            />
          ))}
    </div>
  );
};

export default ProductList;
