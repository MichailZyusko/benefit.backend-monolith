import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { PageOptionsDto } from "src/global/dto/page-options.dto";

export class GetProductsDto extends PageOptionsDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    name: "search",
    description: "Full-text search for the 'name' field",
    required: false,
    example: "Cola",
    default: "",
  })
  readonly search?: string = "";

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
