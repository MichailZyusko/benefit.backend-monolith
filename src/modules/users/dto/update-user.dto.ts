import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty({
    name: "first_name",
    description: "User first name",
    required: false,
    example: "Michail",
  })
  first_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    name: "last_name",
    description: "User last name",
    required: false,
    example: "Zyusko",
  })
  last_name?: string;

  @IsOptional()
  @ApiProperty({
    name: "image",
    description: "User profile image",
    required: false,
    example: "Michail-Zyusko.png",
  })
  image?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    name: "email",
    description: "User email",
    required: false,
    example: "michail.zyusko@gmail.com",
  })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiProperty({
    name: "password",
    description: "User password",
    required: false,
    example: "******",
  })
  password: string;
}
