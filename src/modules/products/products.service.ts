import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entity/product.entity";
import { DataSource, ILike, Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { GetProductsDto } from "./dto/get-products.dto";
import { GetProductByBarcodeDto } from "./dto/get-product-by-barcode.dto";
import { OmitedProduct } from "./types";
import { GetProductByIdDto } from "./dto/get-product-by-id.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async findAll({
    take,
    skip,
    search,
  }: GetProductsDto): Promise<OmitedProduct[]> {
    return this.productRepository.find({
      take,
      skip,
      relationLoadStrategy: "query",
      select: ["id", "name", "image", "offers"],
      // loadRelationIds: {
      //   relations: ["store"],
      // },
      where: {
        // TODO: Replace on FTS (Full text search)
        name: ILike(`%${search}%`),
      },
      relations: {
        offers: {
          store: true,
        },
      },
      cache: {
        // TODO: Replace to real cache system
        id: `products:${search}`,
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
      Product.checkExistenceOfProduct({ product, barcode });

      const { created_at, updated_at, popularity, ...result } =
        await this.productRepository.save(createProductDto);

      await this.dataSource.queryResultCache.remove(["products:"]);

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
      const product = await this.productRepository.findOneOrFail({
        where: { barcode },
        relationLoadStrategy: "query",
        relations: {
          offers: {
            store: true,
          },
        },
        cache: {
          // TODO: Replace to real cache system
          id: `products:${barcode}`,
          milliseconds: 1e4,
        },
      });

      await this.productRepository.increment({ barcode }, "popularity", 1);

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
    getProductByIdDto: { id },
  }: {
    updateProductDto: UpdateProductDto;
    getProductByIdDto: GetProductByIdDto;
  }): Promise<OmitedProduct> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.productRepository.findOneByOrFail({ id });

      // FIXME: .returning("id, barcode, name, description, image")
      const {
        raw: [result],
      } = await this.productRepository
        .createQueryBuilder()
        .update(updateProductDto)
        .returning("id, barcode, name, description, image")
        .where("id = :id", { id })
        .execute();

      await this.dataSource.queryResultCache.remove(["products:"]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteById({ id }: GetProductByIdDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await this.productRepository.findOneByOrFail({ id });

      await this.productRepository.remove(product);
      await this.dataSource.queryResultCache.remove(["products:"]);
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
