import { Offer } from "../entity/offer.entity";

export type OmitedOffer = Omit<Offer, "created_at" | "updated_at">;
