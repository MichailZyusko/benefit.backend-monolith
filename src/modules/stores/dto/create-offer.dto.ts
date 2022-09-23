import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsPositive, Min } from "class-validator";

export class CreateOfferDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    name: "price",
    description: "Product price",
    required: true,
    example: "151",
  })
  price: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @ApiProperty({
    name: "quantity",
    description: "Quantity of products on sale",
    required: true,
    example: "2",
    default: 1,
  })
  quantity: 1;
}
