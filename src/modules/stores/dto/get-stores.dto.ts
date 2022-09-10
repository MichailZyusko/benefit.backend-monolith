import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class GetStoresDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  take?: number = 40;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  skip?: number = 0;
}
