import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
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
}
