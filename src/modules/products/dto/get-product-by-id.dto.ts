import { IsString, IsUUID } from "class-validator";

export class GetProductByIdDto {
  @IsString()
  @IsUUID(4)
  id: string;
}
