import { Product } from "../entity/product.entity";

export type OmitedProduct = Omit<
  Product,
  "popularity" | "created_at" | "updated_at"
>;
