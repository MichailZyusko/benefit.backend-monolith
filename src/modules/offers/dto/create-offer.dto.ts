import { Transform } from "class-transformer";
import {
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import { StoreFranchise } from "src/modules/stores/enums";

export class CreateOfferDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  price: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  quantity: 1;

  @IsString()
  @MaxLength(500)
  storeAddress: string;

  @IsString()
  @MaxLength(13)
  productBardode: string;

  @IsString()
  storeFranchise: StoreFranchise;
}
