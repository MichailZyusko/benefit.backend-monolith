import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Token } from './entities/token.entity';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([Token, User])
  ],
  providers: [TokensService],
  exports: [TokensService]
})
export class TokensModule {}
