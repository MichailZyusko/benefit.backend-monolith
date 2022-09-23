import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class GetProductByBarcodeDto {
  @IsString()
  @MaxLength(13)
  @ApiProperty({
    name: "barcode",
    description: "Product barcode",
    required: true,
    example: "4812345678903",
  })
  barcode: string;
}
