import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { GetOfferByBarcodeAndStoreDto } from "./dto/get-offer-by-barcode-and-store.dto";
import { GetOffersDto } from "./dto/get-offers.dto";
import { UpdateOfferDto } from "./dto/update-offer.dto";
import { OffersService } from "./offers.service";
import { OmitedOffer } from "./types";

@ApiTags("Offers")
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

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() updateOfferDto: UpdateOfferDto,
    @Query() getOfferByBarcodeAndStoreDto: GetOfferByBarcodeAndStoreDto
  ): Promise<OmitedOffer> {
    return await this.offerService.update({
      updateOfferDto,
      getOfferByBarcodeAndStoreDto,
    });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByBarcodeAndStore(
    @Query() getOfferByBarcodeAndStoreDto: GetOfferByBarcodeAndStoreDto
  ): Promise<void> {
    await this.offerService.deleteByBarcodeAndStore(
      getOfferByBarcodeAndStoreDto
    );
  }
}
