export interface Product {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  price: number;
  type: string;
  key: string;
}

export type EquippedItem = Pick<Product, "id" | "name" | "price">;
