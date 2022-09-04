import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class GetProductsDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  take?: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  skip?: number;

  @IsString()
  @IsOptional()
  search?: string;
}
