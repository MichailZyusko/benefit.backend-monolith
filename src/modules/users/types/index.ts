import { User } from "../entity/user.entity";

export type OmitedUser = Omit<
  User,
  "password" | "email" | "created_at" | "updated_at"
>;
