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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { CreateStoreDto } from "./dto/create-store.dto";
import { GetOfferByBarcodeAndStoreIdDto } from "./dto/get-offer-by-barcode-and-store-id.dto";
import { GetStoreByIdDto } from "./dto/get-store-by-id.dto";
import { GetStoresDto } from "./dto/get-stores.dto";
import { UpdateOfferDto } from "./dto/update-offer.dto";
import { StoreService } from "./stores.service";
import { OmitedOffer, OmitedStore } from "./types";

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
  @Get(":storeId")
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

  @Delete(":storeId")
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

  @Get(":storeId/products/:barcode/offers")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Returns an offer by storeId & barcode",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Success" })
  async findOffer(
    @Param() getOfferByBarcodeAndStoreIdDto: GetOfferByBarcodeAndStoreIdDto
  ): Promise<OmitedOffer> {
    return await this.storeService.findOfferByBarcode(
      getOfferByBarcodeAndStoreIdDto
    );
  }

  @Post(":storeId/products/:barcode/offers")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      "Creates the offer according to the parameters passed in the body of the request",
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Success" })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Оffer already exists",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Store or product not found",
  })
  async createOffer(
    @Param() getOfferByBarcodeAndStoreIdDto: GetOfferByBarcodeAndStoreIdDto,
    @Body() createOfferDto: CreateOfferDto
  ): Promise<OmitedOffer> {
    return await this.storeService.createOfferByBarcode({
      createOfferDto,
      getOfferByBarcodeAndStoreIdDto,
    });
  }

  @Put(":storeId/products/:barcode/offers")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      "Updates the offers according to the parameters passed in the request body",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Success" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Store or product not found",
  })
  async update(
    @Body() updateOfferDto: UpdateOfferDto,
    @Param() getOfferByBarcodeAndStoreIdDto: GetOfferByBarcodeAndStoreIdDto
  ): Promise<OmitedOffer> {
    return await this.storeService.updateOfferByBarcode({
      updateOfferDto,
      getOfferByBarcodeAndStoreIdDto,
    });
  }

  @Delete(":storeId/products/:barcode/offers")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Deletes an offer by product barcode",
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Success" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Store or product not found",
  })
  async deleteByBarcodeAndStore(
    @Param() getOfferByBarcodeAndStoreIdDto: GetOfferByBarcodeAndStoreIdDto
  ): Promise<void> {
    await this.storeService.deleteOfferByBarcode(
      getOfferByBarcodeAndStoreIdDto
    );
  }
}
