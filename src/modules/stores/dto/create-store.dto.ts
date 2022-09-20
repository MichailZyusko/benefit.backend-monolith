import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { StoreFranchise } from "../enums";

export class CreateStoreDto {
  @IsString()
  @ApiProperty({
    name: "address",
    description: "Store address",
    required: true,
    example: "Минск, у. Притыцкого, д. 156, э. 1",
    default: "",
  })
  address: string;

  @IsString()
  @ApiProperty({
    name: "franchise",
    description: "Store franchise",
    required: true,
    example: "Соседи",
    default: "",
  })
  franchise: StoreFranchise;
}
