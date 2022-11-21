import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PageOptionsDto {
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    name: "take",
    description: "Number of items per page",
    required: false,
    example: 20,
    default: 40,
  })
  public readonly take?: number = 40;

  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  @ApiProperty({
    name: "page",
    description: "Page number for pagination",
    required: false,
    example: 1,
    minimum: 1,
    default: 1,
  })
  public readonly page?: number = 1;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
