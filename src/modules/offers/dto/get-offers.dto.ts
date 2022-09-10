import { Transform } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from "class-validator";

export class GetOffersDto {
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
  @MaxLength(13)
  @IsOptional()
  barcode?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
