import { ApiProperty } from "@nestjs/swagger";
import { PageOptionsDto } from "src/global/dto/page-options.dto";

type PageMetaDtoParameters = {
  pageOptionsDto: PageOptionsDto;
  count: number;
}

export class PageMetaDto {
  @ApiProperty()
  public readonly page: number;

  @ApiProperty()
  public readonly take: number;

  @ApiProperty()
  public readonly itemCount: number;

  @ApiProperty()
  public readonly pageCount: number;

  @ApiProperty()
  public readonly hasPreviousPage: boolean;

  @ApiProperty()
  public readonly hasNextPage: boolean;

  constructor({ pageOptionsDto: { page, take }, count }: PageMetaDtoParameters) {
    this.page = page;
    this.take = take;
    this.itemCount = count;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}