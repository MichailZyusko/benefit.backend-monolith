import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class GetProductByIdDto {
  @IsString()
  @IsUUID(4)
  @ApiProperty({
    name: "id",
    description: "Product id",
    required: true,
    example: "8668b618-fbe0-4b59-ae71-89bb792f02a6",
  })
  id: string;
}
