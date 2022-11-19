import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class GetProductsDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    name: "take",
    description: "Number of products per page",
    required: false,
    example: 40,
    default: 40,
  })
  take?: number = 40;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    name: "skip",
    description: "Number of products needed to skip",
    required: false,
    example: 0,
    default: 0,
  })
  skip?: number = 0;

  @IsString()
  @IsOptional()
  @ApiProperty({
    name: "search",
    description: "Full-text search for the 'name' field",
    required: false,
    example: "Cola",
    default: "",
  })
  search?: string = "";

  @Transform(({ value }) => {
    switch (typeof value) {
      case 'string': return [value];
      case 'object': return value;

      default: return [];
    }
  })
  @IsArray()
  @IsOptional()
  @ApiProperty({
    name: "storeIds",
    description: "An array of store IDs to filter by store",
    required: false,
    example: "storeIds=f9eac67c-25d0-4e85-b35a-ffd4bfaf2282&storeIds=06f7825d-7303-4042-9328-318e8091e3ee",
    default: "",
  })
  storeIds?: string[];
}
