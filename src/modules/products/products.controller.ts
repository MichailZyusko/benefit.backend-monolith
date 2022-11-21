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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger/dist";
import { Pagination } from "src/global/dto/pagination.dto";

@ApiTags("Products")
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: "Something went wrong",
})
@Controller("products")
export class ProductsController {
  constructor(private readonly productService: ProductsService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      "Returns an array of products with information about offers in each store",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Success" })
  async findAll(
    @Query() getProductsDto: GetProductsDto
  ): Promise<Pagination<OmitedProduct>> {
    return this.productService.findAll(getProductsDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      "Creates the product according to the parameters passed in the body of the request",
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Success" })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Product already exists",
  })
  async create(
    @Body() createProductDto: CreateProductDto
  ): Promise<OmitedProduct> {
    return await this.productService.create(createProductDto);
  }

  @Get(":barcode")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      "Returns the product by its barcode with information about offers in each store",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Success" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product not found",
  })
  async findByBarcode(
    @Param() getProductByBarcodeDto: GetProductByBarcodeDto
  ): Promise<OmitedProduct> {
    return await this.productService.findByBarcode(getProductByBarcodeDto);
  }

  @Put(":barcode")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      "Updates the product according to the parameters passed in the request body",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Success" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product not found",
  })
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @Param() getProductByBarcodeDto: GetProductByBarcodeDto
  ): Promise<OmitedProduct> {
    return await this.productService.update({
      updateProductDto,
      getProductByBarcodeDto,
    });
  }

  @Delete(":barcode")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Deletes a product by its barcode",
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Success" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product not found",
  })
  async deleteByBarcode(
    @Param() getProductByBarcodeDto: GetProductByBarcodeDto
  ): Promise<void> {
    await this.productService.deleteByBarcode(getProductByBarcodeDto);
  }
}
