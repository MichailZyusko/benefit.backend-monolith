import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class GetCategoriesDto {
  @Transform(({ value }) => (value ? parseInt(value) : null))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    name: "parent_id",
    description: "Parent category id. Null if root category",
    required: false,
    example: 2,
  })
  parent_id?: number | null = null;
}
