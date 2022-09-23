import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { OmitedOffer, OmitedStore } from "./types";
import { GetStoresDto } from "./dto/get-stores.dto";
import { CreateStoreDto } from "./dto/create-store.dto";
import { Store } from "./entity/store.entity";
import { GetStoreByIdDto } from "./dto/get-store-by-id.dto";
import { Offer } from "./entity/offer.entity";
import { GetOfferByBarcodeAndStoreIdDto } from "./dto/get-offer-by-barcode-and-store-id.dto";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { Product } from "../products/entity/product.entity";
import { UpdateOfferDto } from "./dto/update-offer.dto";

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async findAll({ take, skip }: GetStoresDto): Promise<OmitedStore[]> {
    return this.storeRepository.find({
      take,
      skip,
      cache: {
        id: "stores",
        milliseconds: 1e4,
      },
    });
  }

  async create(createStoreDto: CreateStoreDto): Promise<OmitedStore> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { address, franchise } = createStoreDto;

      const store = await this.storeRepository.findOneBy({
        address,
        franchise,
      });
      Store.checkExistenceOfStore({ store, address, franchise });

      const { created_at, updated_at, ...result } =
        await this.storeRepository.save(createStoreDto);

      await this.dataSource.queryResultCache.remove(["stores"]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findById({ storeId }: GetStoreByIdDto): Promise<OmitedStore> {
    return this.storeRepository.findOneByOrFail({ id: storeId });
  }

  async deleteById({ storeId }: GetStoreByIdDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const store = await this.storeRepository.findOneByOrFail({ id: storeId });

      await this.storeRepository.remove(store);
      await this.dataSource.queryResultCache.remove(["stores"]);
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findOfferByBarcode({
    storeId,
    barcode,
  }: GetOfferByBarcodeAndStoreIdDto): Promise<OmitedOffer> {
    return this.offerRepository.findOneOrFail({
      relationLoadStrategy: "query",
      relations: {
        store: true,
        product: true,
      },
      where: {
        store: {
          id: storeId,
        },
        product: {
          barcode,
        },
      },
      cache: {
        id: `offers:${storeId}:${barcode}`,
        milliseconds: 1e4,
      },
    });
  }

  async createOfferByBarcode({
    createOfferDto,
    getOfferByBarcodeAndStoreIdDto: { storeId, barcode },
  }: {
    createOfferDto: CreateOfferDto;
    getOfferByBarcodeAndStoreIdDto: GetOfferByBarcodeAndStoreIdDto;
  }): Promise<OmitedOffer> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await this.productRepository.findOneByOrFail({ barcode });
      const store = await this.storeRepository.findOneByOrFail({ id: storeId });
      const offer = await this.offerRepository.findOneBy({ store, product });
      Offer.checkExistenceOfOffer({ offer, barcode, storeId });

      const { created_at, updated_at, ...result } =
        await this.offerRepository.save({
          ...createOfferDto,
          product,
          store,
        });

      await this.dataSource.queryResultCache.remove(["offers", "products:"]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOfferByBarcode({
    updateOfferDto,
    getOfferByBarcodeAndStoreIdDto: { barcode, storeId },
  }: {
    updateOfferDto: UpdateOfferDto;
    getOfferByBarcodeAndStoreIdDto: GetOfferByBarcodeAndStoreIdDto;
  }): Promise<OmitedOffer> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await this.productRepository.findOneByOrFail({ barcode });
      const store = await this.storeRepository.findOneByOrFail({ id: storeId });
      await this.offerRepository.findOneByOrFail({ store, product });

      // FIXME: .returning("price, quantity, id")
      const {
        raw: [result],
      } = await this.offerRepository
        .createQueryBuilder()
        .update(updateOfferDto)
        .returning("price, quantity, id")
        .where("storeId = :storeId", { storeId: store.id })
        .andWhere("productId = :productId", { productId: product.id })
        .execute();

      await this.dataSource.queryResultCache.remove([
        `offers:${storeId}:${barcode}`,
        "products:",
      ]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteOfferByBarcode({
    storeId,
    barcode,
  }: GetOfferByBarcodeAndStoreIdDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await this.productRepository.findOneByOrFail({ barcode });
      const store = await this.storeRepository.findOneByOrFail({ id: storeId });
      const offer = await this.offerRepository.findOneByOrFail({
        store,
        product,
      });

      await this.offerRepository.remove(offer);
      await this.dataSource.queryResultCache.remove([
        `offers:${storeId}:${barcode}`,
        "products:",
      ]);
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
