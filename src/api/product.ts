import { http } from "@/api/http";
import {
  GetProductListRequest,
  GetProductListResponseV2,
  ProductCategoryItem,
} from "mmorntype";

export enum ProductType {
  AURA = "aura",
}

export enum ProductOrder {
  LATEST = "latest",
  PRICIEST = "priciest",
  CHEAPEST = "cheapest",
}

export const getProductCateogies = async () => {
  const response = await http.get<ProductCategoryItem[]>("/product-categories");
  return response.data;
};

export const getProducts = async (query: GetProductListRequest) => {
  const response = await http.get<GetProductListResponseV2>("/products/v2", {
    params: query,
  });
  return response.data;
};
