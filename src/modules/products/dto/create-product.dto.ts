import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @MaxLength(13)
  @ApiProperty({
    name: "barcode",
    description: "Product barcode",
    required: true,
    example: "4812345678903",
  })
  barcode: string;

  @IsString()
  @MaxLength(50)
  @ApiProperty({
    name: "name",
    description: "Product name",
    required: true,
    example: "Coca-Cola, 2л",
  })
  name: string;

  @IsString()
  @MaxLength(500)
  @ApiProperty({
    name: "description",
    description: "Product description",
    required: true,
    example: "Напиток безалкогольлный Coca-Cola 2 литра",
  })
  description: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    name: "category_id",
    description: "Product category",
    required: true,
    example: "1",
  })
  category_id: number;

  @IsOptional()
  @ApiProperty({
    name: "image",
    description: "Product image",
    required: false,
    example: "Coca-Cola-2l.png",
  })
  image?: string;
}
