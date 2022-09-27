import { Injectable } from "@nestjs/common";
import { InjectRepository, InjectDataSource } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Product } from "../products/entity/product.entity";
import { Store } from "../stores/entity/store.entity";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { GetOfferByBarcodeAndStoreDto } from "./dto/get-offer-by-barcode-and-store.dto";
import { GetOffersDto } from "./dto/get-offers.dto";
import { UpdateOfferDto } from "./dto/update-offer.dto";
import { Offer } from "./entity/offer.entity";
import { OmitedOffer } from "./types";

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async findAll(getOffersDto: GetOffersDto): Promise<OmitedOffer[]> {
    const { take, skip, address, barcode } = getOffersDto;

    return this.offerRepository.find({
      relationLoadStrategy: "query",
      relations: {
        store: true,
        product: true,
      },
      where: {
        store: {
          address,
        },
        product: {
          barcode,
        },
      },
      take,
      skip,
      cache: {
        id: "offers",
        milliseconds: 1e4,
      },
    });
  }

  async create(createOfferDto: CreateOfferDto): Promise<OmitedOffer> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {
        productBardode: barcode,
        storeAddress: address,
        storeFranchise: franchise,
        ...offerBody
      } = createOfferDto;

      const product = await this.productRepository.findOneByOrFail({ barcode });
      const store = await this.storeRepository.findOneByOrFail({
        address,
        franchise,
      });
      const offer = await this.offerRepository.findOneBy({ store, product });
      Offer.checkExistenceOfOffer({ offer, barcode, address });

      const { created_at, updated_at, ...result } =
        await this.offerRepository.save({
          ...offerBody,
          product,
          store,
        });

      await this.dataSource.queryResultCache.remove(["offers"]);
      await this.dataSource.queryResultCache.remove(["products"]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findByBarcodeAndStore(
    getOfferByBarcodeAndStoreDto: GetOfferByBarcodeAndStoreDto
  ): Promise<OmitedOffer> {
    const { barcode, address } = getOfferByBarcodeAndStoreDto;

    const product = await this.productRepository.findOneByOrFail({ barcode });
    const store = await this.storeRepository.findOneByOrFail({ address });
    const offer = await this.offerRepository.findOneByOrFail({
      store,
      product,
    });

    return offer;
  }

  async update({
    updateOfferDto,
    getOfferByBarcodeAndStoreDto: { barcode, address },
  }: {
    updateOfferDto: UpdateOfferDto;
    getOfferByBarcodeAndStoreDto: GetOfferByBarcodeAndStoreDto;
  }): Promise<OmitedOffer> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await this.productRepository.findOneByOrFail({ barcode });
      const store = await this.storeRepository.findOneByOrFail({ address });
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

      await this.dataSource.queryResultCache.remove(["offers"]);
      await this.dataSource.queryResultCache.remove(["products"]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteByBarcodeAndStore(
    getOfferByBarcodeAndStoreDto: GetOfferByBarcodeAndStoreDto
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { barcode, address } = getOfferByBarcodeAndStoreDto;

      const product = await this.productRepository.findOneByOrFail({ barcode });
      const store = await this.storeRepository.findOneByOrFail({ address });
      const offer = await this.offerRepository.findOneByOrFail({
        store,
        product,
      });

      await this.offerRepository.remove(offer);
      await this.dataSource.queryResultCache.remove(["offers"]);
      await this.dataSource.queryResultCache.remove(["products"]);
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
