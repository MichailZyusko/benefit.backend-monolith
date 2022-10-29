import { Injectable } from "@nestjs/common";
import { InjectRepository, InjectDataSource } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { GetUserByIdDto } from "./dto/get-user-by-id.dto";
import { GetUsersDto } from "./dto/get-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entity/user.entity";
import { OmitedUser } from "./types";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAll({ take, skip }: GetUsersDto): Promise<OmitedUser[]> {
    return this.userRepository.find({
      take,
      skip,
      cache: {
        id: "users",
        milliseconds: 1e4,
      },
    });
  }

  async findById({ id }: GetUserByIdDto): Promise<OmitedUser> {
    return this.userRepository.findOneByOrFail({ id });
  }

  async update({
    updateUserDto,
    getUserByIdDto: { id },
  }: {
    updateUserDto: UpdateUserDto;
    getUserByIdDto: GetUserByIdDto;
  }): Promise<OmitedUser> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.userRepository.findOneByOrFail({ id });

      const {
        raw: [result],
      } = await this.userRepository
        .createQueryBuilder()
        .update(updateUserDto)
        .returning("id, first_name, last_name, image")
        .where("id = :id", { id })
        .execute();

      await this.dataSource.queryResultCache.remove(["users"]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteById({ id }: GetUserByIdDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userRepository.findOneByOrFail({ id });

      await this.userRepository.remove(user);
      await this.dataSource.queryResultCache.remove(["users"]);
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
