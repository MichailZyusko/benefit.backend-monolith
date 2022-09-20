import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class GetStoresDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    name: "take",
    description: "Number of stores per page",
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
    description: "Number of stores needed to skip",
    required: false,
    example: 0,
    default: 0,
  })
  skip?: number = 0;
}
