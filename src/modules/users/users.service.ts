import { Injectable } from "@nestjs/common";
import { InjectRepository, InjectDataSource } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository, DataSource } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserByEmailDto } from "./dto/get-user-by-email.dto";
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
    private dataSource: DataSource
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

      const hashedPassword = await bcrypt.hash(password, +process.env.SALT);

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

  async findByEmail({ email }: GetUserByEmailDto): Promise<OmitedUser> {
    return this.userRepository.findOneByOrFail({ email });
  }

  async update({
    updateUserDto,
    getUserByEmailDto: { email },
  }: {
    updateUserDto: UpdateUserDto;
    getUserByEmailDto: GetUserByEmailDto;
  }): Promise<OmitedUser> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.userRepository.findOneByOrFail({ email });

      const {
        raw: [result],
      } = await this.userRepository
        .createQueryBuilder()
        .update(updateUserDto)
        .where("email = :email", { email })
        .returning("id, first_name, last_name, image")
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

  async deleteByEmail({ email }: GetUserByEmailDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userRepository.findOneByOrFail({ email });

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
