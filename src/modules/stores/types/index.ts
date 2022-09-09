import { Store } from "../entity/store.entity";

export type OmitedStore = Omit<Store, "created_at" | "updated_at">;
