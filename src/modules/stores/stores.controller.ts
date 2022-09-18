import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateStoreDto } from "./dto/create-store.dto";
import { GetStoreByIdDto } from "./dto/get-store-by-id.dto";
import { GetStoresDto } from "./dto/get-stores.dto";
import { StoreService } from "./stores.service";
import { OmitedStore } from "./types";

@ApiTags("Stores")
@Controller("stores")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() getStoresDto: GetStoresDto): Promise<OmitedStore[]> {
    return await this.storeService.findAll(getStoresDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createStoreDto: CreateStoreDto): Promise<OmitedStore> {
    return await this.storeService.create(createStoreDto);
  }

  // TODO: Is really need ???
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param() getStoreByIdDto: GetStoreByIdDto
  ): Promise<OmitedStore> {
    return await this.storeService.findById(getStoreByIdDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param() getStoreByIdDto: GetStoreByIdDto): Promise<void> {
    await this.storeService.deleteById(getStoreByIdDto);
  }

  // @Delete(":id/offers")
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async deleteOfferById(
  //   @Param() getStoreByIdDto: GetStoreByIdDto
  // ): Promise<void> {
  //   await this.storeService.deleteById(getStoreByIdDto);
  // }
}
