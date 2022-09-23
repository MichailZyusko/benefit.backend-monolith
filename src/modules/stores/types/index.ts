import { Offer } from "../entity/offer.entity";
import { Store } from "../entity/store.entity";

export type OmitedStore = Omit<Store, "created_at" | "updated_at">;

export type OmitedOffer = Omit<Offer, "created_at" | "updated_at">;
