import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entity/product.entity";
import { DataSource, ILike, In, Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { GetProductsDto } from "./dto/get-products.dto";
import { GetProductByBarcodeDto } from "./dto/get-product-by-barcode.dto";
import { OmitedProduct } from "./types";
import { Category } from "../categories/entity/category.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectDataSource()
    private dataSource: DataSource
  ) { }

  async findAll({
    take,
    skip,
    search,
    storeIds,
  }: GetProductsDto): Promise<OmitedProduct[]> {
    return this.productRepository.find({
      take,
      skip,
      relationLoadStrategy: "query",
      select: ["id", "name", "image", "offers", "barcode", "description", "measurement_unit", "volume", "popularity"],
      // loadRelationIds: {
      //   relations: ["store"],
      // },
      where: {
        // TODO: Replace on FTS (Full text search)
        name: ILike(`%${search}%`),
        offers: storeIds ? {
          store: {
            id: In(storeIds),
          }
        } : {},
      },
      order: {
        popularity: 'DESC'
      },
      relations: {
        offers: {
          store: true,
        },
        category: true,
      },
      cache: {
        // TODO: Replace to real cache system
        id: `products:${search}:${storeIds}`,
        milliseconds: 1e4,
      },
    });
  }

  async create(createProductDto: CreateProductDto): Promise<OmitedProduct> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { barcode, category_id, ...productBody } = createProductDto;

      const product = await this.productRepository.findOneBy({ barcode });
      Product.checkExistenceOfProduct({ product, barcode });

      const category = await this.categoryRepository.findOneByOrFail({
        id: category_id,
      });

      const { created_at, updated_at, ...result } =
        await this.productRepository.save({
          ...productBody,
          barcode,
          category,
        });

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
    updateProductDto: { category_id, ...productBody },
    getProductByBarcodeDto: { barcode },
  }: {
    updateProductDto: UpdateProductDto;
    getProductByBarcodeDto: GetProductByBarcodeDto;
  }): Promise<OmitedProduct> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.productRepository.findOneByOrFail({ barcode });

      let category: Category;
      if (category_id) {
        category = await this.categoryRepository.findOneByOrFail({
          id: category_id,
        });
      }

      // FIXME: .returning("id, barcode, name, description, image")
      const {
        raw: [result],
      } = await this.productRepository
        .createQueryBuilder()
        .update({ ...productBody, category })
        .returning("id, barcode, name, description, image, popularity")
        .where("barcode = :barcode", { barcode })
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

  async deleteByBarcode({ barcode }: GetProductByBarcodeDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await this.productRepository.findOneByOrFail({ barcode });

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
