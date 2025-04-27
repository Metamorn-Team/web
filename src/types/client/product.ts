import { ItemGrade } from "mmorntype/dist/src/domain/types/item.types";
import { PurchasedStatus } from "mmorntype/dist/src/domain/types/product.types";

export interface Product {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  price: number;
  type: string;
  key: string;
  grade: ItemGrade;
  purchasedStatus: PurchasedStatus;
}

export type EquippedItem = Pick<Product, "id" | "name" | "price">;
