import { IsOptional, IsString } from "class-validator";
import { StoreFranchise } from "../enums";

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  franchise: StoreFranchise;
}
