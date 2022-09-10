import { IsString, MaxLength } from "class-validator";

export class GetOfferByBarcodeAndStoreDto {
  @IsString()
  @MaxLength(13)
  barcode: string;

  @IsString()
  address: string;
}
