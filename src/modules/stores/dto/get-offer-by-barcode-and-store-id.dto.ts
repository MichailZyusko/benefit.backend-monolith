import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, MaxLength } from "class-validator";

export class GetOfferByBarcodeAndStoreIdDto {
  @IsString()
  @IsUUID(4)
  @ApiProperty({
    name: "storeId",
    description: "Store id",
    required: true,
    example: "8668b618-fbe0-4b59-ae71-89bb792f02a6",
  })
  storeId: string;

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
