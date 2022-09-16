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
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { GetProductsDto } from "./dto/get-products.dto";
import { GetProductByBarcodeDto } from "./dto/get-product-by-barcode.dto";
import { OmitedProduct } from "./types";
import { GetProductByIdDto } from "./dto/get-product-by-id.dto";

@Controller("products")
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() getProductsDto: GetProductsDto
  ): Promise<OmitedProduct[]> {
    return await this.productService.findAll(getProductsDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto
  ): Promise<OmitedProduct> {
    return await this.productService.create(createProductDto);
  }

  @Get(":barcode")
  @HttpCode(HttpStatus.OK)
  async findByBarcode(
    @Param() getProductByBarcodeDto: GetProductByBarcodeDto
  ): Promise<OmitedProduct> {
    return await this.productService.findByBarcode(getProductByBarcodeDto);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @Param() getProductByIdDto: GetProductByIdDto
  ): Promise<OmitedProduct> {
    return await this.productService.update({
      updateProductDto,
      getProductByIdDto,
    });
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByBarcode(
    @Param() getProductByIdDto: GetProductByIdDto
  ): Promise<void> {
    await this.productService.deleteById(getProductByIdDto);
  }
}
