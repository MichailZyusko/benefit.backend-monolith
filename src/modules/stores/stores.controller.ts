import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { CreateStoreDto } from "./dto/create-store.dto";
import { GetStoreByAddressDto } from "./dto/get-store-by-address.dto";
import { GetStoresDto } from "./dto/get-stores.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";
import { StoreService } from "./stores.service";
import { OmitedStore } from "./types";

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

  @Get(":address")
  @HttpCode(HttpStatus.OK)
  async findByAddress(
    @Param() getStoreByAddressDto: GetStoreByAddressDto
  ): Promise<OmitedStore> {
    return await this.storeService.findByAddress(getStoreByAddressDto);
  }

  @Put(":address")
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() updateStoreDto: UpdateStoreDto,
    @Param() getStoreByAddressDto: GetStoreByAddressDto
  ): Promise<OmitedStore> {
    return await this.storeService.update({
      updateStoreDto,
      getStoreByAddressDto,
    });
  }

  @Delete(":address")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByAddress(
    @Param() getStoreByAddressDto: GetStoreByAddressDto
  ): Promise<void> {
    await this.storeService.deleteByAddress(getStoreByAddressDto);
  }
}
