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
import { OmitedProduct } from "./types";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async findAll({
    take = 40,
    skip = 0,
  }: GetProductsDto): Promise<OmitedProduct[]> {
    return this.productRepository.find({
      take,
      skip,
      cache: {
        id: "products",
        milliseconds: 1e4,
      },
    });
  }

  async create(createProductDto: CreateProductDto): Promise<OmitedProduct> {
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

      const { created_at, updated_at, popularity, ...result } =
        await this.productRepository.save(createProductDto);

      await this.dataSource.queryResultCache.remove(["products"]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findByBarcode({
    barcode,
  }: GetProductByBarcodeDto): Promise<OmitedProduct> {
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

      await this.productRepository.increment({ barcode }, "popularity", 1);
      // TODO: Is really need
      // await this.dataSource.queryResultCache.remove(["products"]);

      return product;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update({
    updateProductDto,
    getProductByBarcodeDto: { barcode },
  }: {
    updateProductDto: UpdateProductDto;
    getProductByBarcodeDto: GetProductByBarcodeDto;
  }): Promise<OmitedProduct> {
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

      // FIXME: .returning("id, barcode, name, description, image")
      const {
        raw: [result],
      } = await this.productRepository
        .createQueryBuilder()
        .update(updateProductDto)
        .returning("id, barcode, name, description, image")
        .where("barcode = :barcode", { barcode })
        .execute();

      await this.dataSource.queryResultCache.remove(["products"]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
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

      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
