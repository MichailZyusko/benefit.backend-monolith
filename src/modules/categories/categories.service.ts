import { Injectable } from "@nestjs/common";
import { InjectRepository, InjectDataSource } from "@nestjs/typeorm";
import { Repository, DataSource, IsNull } from "typeorm";
import { CreateCategoriesDto } from "./dto/create-category.dto";
import { GetCategoriesDto } from "./dto/get-categories.dto";
import { Category } from "./entity/category.entity";
import { OmitedCategory } from "./types";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async findAll({ parent_id }: GetCategoriesDto): Promise<OmitedCategory[]> {
    return this.categoryRepository.find({
      where: {
        parent_id: parent_id || IsNull(),
      },
      cache: {
        // TODO: Replace to real cache system
        id: `categories:${parent_id}`,
        milliseconds: 1e6,
      },
    });
  }

  async create(
    createCategoriesDto: CreateCategoriesDto
  ): Promise<OmitedCategory> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { name, level, parent_id } = createCategoriesDto;

      await this.categoryRepository.findOneByOrFail({ id: parent_id });

      const category = await this.categoryRepository.findOneBy({
        name,
        level,
        parent_id,
      });
      Category.checkExistenceOfCategory({ category, name, level, parent_id });

      const { created_at, updated_at, ...result } =
        await this.categoryRepository.save(createCategoriesDto);

      await this.dataSource.queryResultCache.remove([
        `categories:${parent_id}`,
      ]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
