import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateTokenDto } from './dto/create-token.dto';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { Token } from './entities/token.entity';
import { Tokens } from './types';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entity/user.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectDataSource()
    private dataSource: DataSource,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateTokens({ userId, email }: GenerateTokenDto): Promise<Tokens> {
      const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '7m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async save({ userId, refreshToken }: CreateTokenDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userRepository.findOneByOrFail({ id: userId });
      const hashedRefreshToken = await bcrypt.hash(
        refreshToken,
        +this.configService.getOrThrow("SALT")
      );

      await this.tokenRepository.upsert({
        user,
        refresh_token: hashedRefreshToken
      }, ['user']);
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    }
    finally {
      await queryRunner.release();
    }
  }

  async getRefreshToken({ userId }: { userId: string }) {
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    const token = await this.tokenRepository.findOneByOrFail({ user });

    return { refreshToken: token.refresh_token };
  }

  async revokeTokens({ userId }: { userId: string }): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userRepository.findOneByOrFail({ id: userId });
      await this.tokenRepository.findOneByOrFail({ user });

      await this.tokenRepository.update({ user }, { refresh_token: null })
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } 
    finally {
      await queryRunner.release();
    }
  }
}
