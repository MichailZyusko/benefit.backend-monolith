import { IsString, MaxLength } from "class-validator";

export class GetProductByBarcodeDto {
  @IsString()
  @MaxLength(13)
  barcode: string;
}
