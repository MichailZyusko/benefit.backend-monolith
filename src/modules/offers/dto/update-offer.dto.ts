import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class UpdateOfferDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: 1;
}
