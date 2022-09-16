import { IsString, IsUUID } from "class-validator";

export class GetStoreByIdDto {
  @IsString()
  @IsUUID(4)
  id: string;
}
