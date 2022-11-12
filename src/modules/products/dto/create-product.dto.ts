import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from "class-validator";
import { MeasurementUnit } from "../enums";

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
  @MaxLength(2000)
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

  @IsString()
  @ApiProperty({
    name: "measurement_unit",
    description: "Product measurement unit",
    required: true,
    example: "кг.",
    default: "кг.",
  })
  measurement_unit: MeasurementUnit;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    name: "volume",
    description: "Volume, weight or quantity of the product",
    required: true,
    example: "2",
    default: 2,
  })
  volume: number;

  @IsOptional()
  @ApiProperty({
    name: "image",
    description: "Product image",
    required: false,
    example: "Coca-Cola-2l.png",
  })
  image?: string;
}
