import { IsString } from "class-validator";
import { StoreFranchise } from "../enums";

export class CreateStoreDto {
  @IsString()
  address: string;

  @IsString()
  franchise: StoreFranchise;
}
