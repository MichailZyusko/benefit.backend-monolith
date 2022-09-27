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
import { CreateOfferDto } from "./dto/create-offer.dto";
import { GetOfferByBarcodeAndStoreDto } from "./dto/get-offer-by-barcode-and-store.dto";
import { GetOffersDto } from "./dto/get-offers.dto";
import { UpdateOfferDto } from "./dto/update-offer.dto";
import { OffersService } from "./offers.service";
import { OmitedOffer } from "./types";

@Controller("offers")
export class OffersController {
  constructor(private readonly offerService: OffersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() getOffersDto: GetOffersDto): Promise<OmitedOffer[]> {
    return await this.offerService.findAll(getOffersDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOfferDto: CreateOfferDto): Promise<OmitedOffer> {
    return await this.offerService.create(createOfferDto);
  }

  @Get(":barcode/:address")
  @HttpCode(HttpStatus.OK)
  async findByBarcodeAndStore(
    @Param() getOfferByBarcodeAndStoreDto: GetOfferByBarcodeAndStoreDto
  ): Promise<OmitedOffer> {
    return await this.offerService.findByBarcodeAndStore(
      getOfferByBarcodeAndStoreDto
    );
  }

  @Put(":barcode/:address")
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() updateOfferDto: UpdateOfferDto,
    @Param() getOfferByBarcodeAndStoreDto: GetOfferByBarcodeAndStoreDto
  ): Promise<OmitedOffer> {
    return await this.offerService.update({
      updateOfferDto,
      getOfferByBarcodeAndStoreDto,
    });
  }

  @Delete(":barcode/:address")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByBarcodeAndStore(
    @Param() getOfferByBarcodeAndStoreDto: GetOfferByBarcodeAndStoreDto
  ): Promise<void> {
    await this.offerService.deleteByBarcodeAndStore(
      getOfferByBarcodeAndStoreDto
    );
  }
}
