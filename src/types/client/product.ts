import { ItemGrade } from "mmorntype/dist/src/domain/types/item.types";
import { PurchasedStatus } from "mmorntype/dist/src/domain/types/product.types";

export interface Product {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  originPrice: number;
  saledPrice: number | null;
  discountRate: number | null;
  promotionName: string | null;
  type: string;
  key: string;
  grade: ItemGrade;
  purchasedStatus: PurchasedStatus;
}

export interface EquippedItem {
  id: string;
  name: string;
  price: number;
}
