import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  image?: string | null;
}
