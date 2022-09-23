import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class GetStoreByIdDto {
  @IsString()
  @IsUUID(4)
  @ApiProperty({
    name: "storeId",
    description: "Store id",
    required: true,
    example: "8668b618-fbe0-4b59-ae71-89bb792f02a6",
  })
  storeId: string;
}
