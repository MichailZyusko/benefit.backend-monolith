import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

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
    description: "Number of products needed to skip ",
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
}
