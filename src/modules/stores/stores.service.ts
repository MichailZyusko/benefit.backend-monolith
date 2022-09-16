import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { OmitedStore } from "./types";
import { GetStoresDto } from "./dto/get-stores.dto";
import { CreateStoreDto } from "./dto/create-store.dto";
import { Store } from "./entity/store.entity";
import { GetStoreByIdDto } from "./dto/get-store-by-id.dto";

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

  async findById({ id }: GetStoreByIdDto): Promise<OmitedStore> {
    return this.storeRepository.findOneByOrFail({ id });
  }

  async deleteById({ id }: GetStoreByIdDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const store = await this.storeRepository.findOneByOrFail({ id });

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
