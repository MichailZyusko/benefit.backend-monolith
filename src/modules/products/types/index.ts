import { Product } from "../entity/product.entity";

export type OmitedProduct = Omit<
  Product,
  "created_at" | "updated_at"
>;
