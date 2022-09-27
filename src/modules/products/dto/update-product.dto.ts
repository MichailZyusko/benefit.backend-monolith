import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from "class-validator";

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    name: "name",
    description: "Product name",
    required: false,
    example: "Coca-Cola, 2л",
  })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({
    name: "description",
    description: "Product description",
    required: false,
    example: "Напиток безалкогольлный Coca-Cola 2 литра",
  })
  description?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    name: "category_id",
    description: "Product category",
    required: false,
    example: "1",
  })
  category_id?: number;

  @IsOptional()
  @ApiProperty({
    name: "image",
    description: "Product image",
    required: false,
    nullable: true,
    example: "Coca-Cola-2l.png",
  })
  image?: string | null;
}
