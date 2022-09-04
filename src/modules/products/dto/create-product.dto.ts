import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProductDto {
  @IsString()
  @MaxLength(13)
  barcode: string;

  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsOptional()
  image?: string;
}
