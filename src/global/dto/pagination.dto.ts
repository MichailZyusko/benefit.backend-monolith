import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { PageMetaDto } from "./page-meta.dto";

type TResponce<T> = {
  data: T[],
  meta: PageMetaDto,
}

export class Pagination<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  public readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  public readonly meta: PageMetaDto;

  constructor({ data, meta }: TResponce<T>) {
    this.data = data;
    this.meta = meta;
  }
}