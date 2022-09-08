import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class GetUsersDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  take?: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  skip?: number;
}
