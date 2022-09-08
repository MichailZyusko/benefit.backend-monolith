import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  first_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  last_name?: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string;
}
