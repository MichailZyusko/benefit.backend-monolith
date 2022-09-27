import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  ValidateIf,
} from "class-validator";

export class CreateCategoriesDto {
  @Transform(({ value }) => (value ? parseInt(value) : null))
  @ValidateIf((_object, value) => value !== null)
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    name: "parent_id",
    description: "Parent category id. Null if root category",
    required: true,
    example: 2,
  })
  parent_id: number = null;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    name: "level",
    description: "Category nesting level",
    required: true,
    example: 2,
    default: 1,
  })
  level = 1;

  @IsString()
  @MaxLength(50)
  @ApiProperty({
    name: "name",
    description: "Category name",
    required: true,
    example: "Фрукты",
  })
  name = "";
}
