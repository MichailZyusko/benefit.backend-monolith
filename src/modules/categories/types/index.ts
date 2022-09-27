import { Category } from "../entity/category.entity";

export type OmitedCategory = Omit<Category, "created_at" | "updated_at">;
