import { IsString, IsUUID } from "class-validator";

export class GetUserByIdDto {
  @IsString()
  @IsUUID(4)
  id: string;
}
