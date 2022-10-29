import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MinLength,
} from "class-validator";

export class LogInDto {
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
