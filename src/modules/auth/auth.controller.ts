import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Payload } from '../tokens/types';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/login.dto';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      "Creates the user according to the parameters passed in the body of the request",
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Success" })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "User with same email already exists",
  })
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signin(@Body() logInDto: LogInDto) {
    return this.authService.signIn(logInDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('signout')
  logout(@Req() req: Request & { user: Payload }) {
    return this.authService.signOut(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Req() req: Request & { user: Payload }) {
    const { sub: userId, refreshToken, email } = req.user;

    return this.authService.refreshTokens({
      userId,
      chekingRefreshToken: refreshToken,
      email
    });
  }
}
