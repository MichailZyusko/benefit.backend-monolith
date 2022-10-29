import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { LogInDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { TokensService } from '../tokens/tokens.service';
import { Tokens } from '../tokens/types';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LogOutDto } from './dto/logout.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectDataSource()
    private dataSource: DataSource,
    private tokenService: TokensService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<Tokens> {
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
     
      const newUser = await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });

      await this.dataSource.queryResultCache.remove(["users"]);

      const tokens = await this.tokenService.generateTokens({ userId: newUser.id, email });
      await this.tokenService.save({ userId: newUser.id, refreshToken: tokens.refreshToken });

      return tokens;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

	async signIn({ email, password }: LogInDto) {
    const user = await this.userRepository.findOneByOrFail({ email });

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new BadRequestException('Password is incorrect');
    
    const tokens = await this.tokenService.generateTokens({ userId: user.id, email });
    await this.tokenService.save({ userId: user.id, refreshToken: tokens.refreshToken });

    return tokens;
  }

  async signOut({ sub }: LogOutDto) {
    await this.tokenService.revokeTokens({ userId: sub });
  }

  async refreshTokens({ userId, chekingRefreshToken, email }: RefreshDto): Promise<Tokens> {
    const { refreshToken } = await this.tokenService.getRefreshToken({ userId });
   
    const refreshTokenMatches =await bcrypt.compare(
      chekingRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    
    const tokens = await this.tokenService.generateTokens({ userId, email });
    await this.tokenService.save({ userId, refreshToken: tokens.refreshToken });

    return tokens;
  }
}