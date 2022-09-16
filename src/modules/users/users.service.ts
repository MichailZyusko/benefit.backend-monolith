import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository, InjectDataSource } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository, DataSource } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserByIdDto } from "./dto/get-user-by-email.dto";
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
    private configService: ConfigService
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

  async create(createUserDto: CreateUserDto): Promise<OmitedUser> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { email, password } = createUserDto;

      const user = await this.userRepository.findOneBy({ email });
      User.checkExistenceOfUser({ user, email });

      const hashedPassword = await bcrypt.hash(
        password,
        +this.configService.getOrThrow("SALT")
      );

      const {
        password: _pswd,
        email: _eml,
        created_at,
        updated_at,
        ...result
      } = await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });

      await this.dataSource.queryResultCache.remove(["users"]);

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
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
