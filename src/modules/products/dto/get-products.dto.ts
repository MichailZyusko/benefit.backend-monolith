import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class GetProductsDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  take?: number = 40;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  skip?: number = 0;

  @IsString()
  @IsOptional()
  search?: string = "";
}
