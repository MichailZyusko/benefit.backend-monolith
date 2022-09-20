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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateStoreDto } from "./dto/create-store.dto";
import { GetStoreByIdDto } from "./dto/get-store-by-id.dto";
import { GetStoresDto } from "./dto/get-stores.dto";
import { StoreService } from "./stores.service";
import { OmitedStore } from "./types";

@ApiTags("Stores")
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: "Something went wrong",
})
@Controller("stores")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Returns an array of stores",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Success" })
  async findAll(@Query() getStoresDto: GetStoresDto): Promise<OmitedStore[]> {
    return await this.storeService.findAll(getStoresDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      "Creates the store according to the parameters passed in the body of the request",
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Success" })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Store already exists",
  })
  async create(@Body() createStoreDto: CreateStoreDto): Promise<OmitedStore> {
    return await this.storeService.create(createStoreDto);
  }

  // TODO: Is really need ???
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Returns the store by its id",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Success" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Store not found",
  })
  async findById(
    @Param() getStoreByIdDto: GetStoreByIdDto
  ): Promise<OmitedStore> {
    return await this.storeService.findById(getStoreByIdDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Deletes a store by its id",
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Success" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Store not found",
  })
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
