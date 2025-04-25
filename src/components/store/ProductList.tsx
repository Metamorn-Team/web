"use client";

import { ProductType, ProductOrder } from "@/api/product";
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
  type: ProductType;
  order: ProductOrder;
  page: number;
  limit: number;
  onAddEquippedItem: (item: EquippedItem) => void;
}

const ProductList = ({
  type,
  order,
  page,
  limit,
  onAddEquippedItem,
}: ProductListProps) => {
  const { data, isLoading } = useGetProducts({
    type,
    order,
    limit,
    page,
  });

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
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
            />
          ))}
    </div>
  );
};

export default ProductList;
