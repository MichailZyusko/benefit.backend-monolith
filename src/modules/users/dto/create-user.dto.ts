import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    name: "first_name",
    description: "User first name",
    required: true,
    example: "Michail",
  })
  first_name: string;

  @IsString()
  @MaxLength(50)
  @ApiProperty({
    name: "last_name",
    description: "User last name",
    required: true,
    example: "Zyusko",
  })
  last_name: string;

  @IsOptional()
  @ApiProperty({
    name: "image",
    description: "User profile image",
    required: false,
    example: "Michail-Zyusko.png",
  })
  image?: string;

  @IsEmail()
  @ApiProperty({
    name: "email",
    description: "User email",
    required: true,
    example: "michail.zyusko@gmail.com",
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    name: "password",
    description: "User password",
    required: true,
    example: "******",
  })
  password: string;
}
