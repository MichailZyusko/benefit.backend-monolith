import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MinLength,
} from "class-validator";

export class LogOutDto {
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
    name: "subject",
    description: "User id",
    required: true,
    example: "******",
  })
  sub: string;
}
