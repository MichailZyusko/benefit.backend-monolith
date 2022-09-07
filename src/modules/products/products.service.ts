import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entity/product.entity";
import { DataSource, Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { GetProductsDto } from "./dto/get-products.dto";
import { GetProductByBarcodeDto } from "./dto/get-product-by-barcode.dto";
import { DBExceptions } from "src/exceptions";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async findAll({ take = 40, skip = 0 }: GetProductsDto): Promise<Product[]> {
    return this.productRepository.find({
      take,
      skip,
      cache: {
        id: "products",
        milliseconds: 1e4,
      },
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { barcode } = createProductDto;

      const product = await this.productRepository.findOneBy({ barcode });

      if (product)
        throw new BadRequestException({
          message: `Product with barcode: ${barcode} already exists`,
          code: DBExceptions.PRODUCT_ALREADY_EXISTS,
        });

      const result = await this.productRepository.save(createProductDto);

      await this.dataSource.queryResultCache.remove(["products"]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findByBarcode({ barcode }: GetProductByBarcodeDto): Promise<Product> {
    const product = await this.productRepository.findOneBy({ barcode });

    if (!product)
      throw new NotFoundException({
        message: `Product with barcode: ${barcode} not found`,
        code: DBExceptions.PRODUCT_NOT_FOUND,
      });

    return product;
  }

  async update({
    updateProductDto,
    getProductByBarcodeDto: { barcode },
  }: {
    updateProductDto: UpdateProductDto;
    getProductByBarcodeDto: GetProductByBarcodeDto;
  }): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await this.productRepository.findOneBy({ barcode });

      if (!product)
        throw new NotFoundException({
          message: `Product with barcode: ${barcode} not found`,
          code: DBExceptions.PRODUCT_NOT_FOUND,
        });

      const {
        raw: [result],
      } = await this.productRepository
        .createQueryBuilder()
        .update(updateProductDto)
        .where("barcode = :barcode", { barcode })
        .returning("*")
        .updateEntity(true)
        .execute();
      await this.dataSource.queryResultCache.remove(["products"]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteByBarcode({ barcode }: GetProductByBarcodeDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await this.productRepository.findOneBy({ barcode });

      if (!product)
        throw new NotFoundException({
          message: `Product with barcode: ${barcode} not found`,
          code: DBExceptions.PRODUCT_NOT_FOUND,
        });

      await this.productRepository.remove(product);
      await this.dataSource.queryResultCache.remove(["products"]);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}