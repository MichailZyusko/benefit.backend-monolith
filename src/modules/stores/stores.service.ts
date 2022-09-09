import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { DBExceptions } from "src/exceptions";
import { OmitedStore } from "./types";
import { GetStoresDto } from "./dto/get-stores.dto";
import { CreateStoreDto } from "./dto/create-store.dto";
import { Store } from "./entity/store.entity";
import { GetStoreByAddressDto } from "./dto/get-store-by-address.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
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
      const { address } = createStoreDto;

      const store = await this.storeRepository.findOneBy({ address });

      if (store)
        throw new BadRequestException({
          message: `Store with address: "${address}" already exists`,
          code: DBExceptions.STORE_ALREADY_EXISTS,
        });

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

  async findByAddress({ address }: GetStoreByAddressDto): Promise<OmitedStore> {
    const store = await this.storeRepository.findOneBy({ address });

    if (!store)
      throw new NotFoundException({
        message: `Store with address: "${address}" not found`,
        code: DBExceptions.STORE_NOT_FOUND,
      });

    return store;
  }

  async update({
    updateStoreDto,
    getStoreByAddressDto: { address },
  }: {
    updateStoreDto: UpdateStoreDto;
    getStoreByAddressDto: GetStoreByAddressDto;
  }): Promise<OmitedStore> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const store = await this.storeRepository.findOneBy({ address });

      if (!store)
        throw new NotFoundException({
          message: `Store with address: "${address}" not found`,
          code: DBExceptions.STORE_NOT_FOUND,
        });

      // FIXME: .returning("id, address, franchise")
      const {
        raw: [result],
      } = await this.storeRepository
        .createQueryBuilder()
        .update(updateStoreDto)
        .returning("id, address, franchise")
        .where("address = :address", { address })
        .execute();

      await this.dataSource.queryResultCache.remove(["stores"]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteByAddress({ address }: GetStoreByAddressDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const store = await this.storeRepository.findOneBy({ address });

      if (!store)
        throw new NotFoundException({
          message: `Store with address: "${address}" not found`,
          code: DBExceptions.STORE_NOT_FOUND,
        });

      await this.storeRepository.remove(store);
      await this.dataSource.queryResultCache.remove(["stores"]);
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
