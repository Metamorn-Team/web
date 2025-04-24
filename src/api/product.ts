import { http } from "@/api/http";
import {
  GetProductListRequest,
  GetProductListResponse,
  ProductCategoryItem,
} from "mmorntype";

export enum ProductCategory {
  AURA = "오라",
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
  const response = await http.get<GetProductListResponse>("/products", {
    params: query,
  });
  return response.data;
};
