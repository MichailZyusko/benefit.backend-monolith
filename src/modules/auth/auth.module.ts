import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { TokensModule } from '../tokens/tokens.module';
import { User } from '../users/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule,
    TokensModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy ],
  controllers: [AuthController],
})
export class AuthModule {}
