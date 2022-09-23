import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class UpdateOfferDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    name: "price",
    description: "Product price",
    required: false,
    example: "151",
  })
  price?: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @IsOptional()
  @ApiProperty({
    name: "quantity",
    description: "Quantity of products on sale",
    required: false,
    example: "2",
    default: 1,
  })
  quantity?: 1;
}
