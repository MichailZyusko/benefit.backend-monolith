import { IsString } from "class-validator";

export class GetStoreByAddressDto {
  @IsString()
  address: string;
}
