import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Payload } from '../tokens/types';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/login.dto';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@ApiTags("Auth")
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: "Something went wrong",
})
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

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

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      "Checks if the current user is in the database, and allows access to resources by generating access tokens and updates.",
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Success" })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Password or email are incorrect",
  })
  @Post('signin')
  signin(@Body() logInDto: LogInDto) {
    return this.authService.signIn(logInDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      "Checks if the current user and his update token are in the database, and deletes the update token from the database. ",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "User with this email not exists",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "User does not have an update token in the database ",
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Success" })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @Post('signout')
  logout(@Req() req: Request & { user: Payload }) {
    return this.authService.signOut(req.user);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Updates the refresh token.",
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Success" })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "RefreshToken is incorrect. Access Denied",
  })
  @ApiBearerAuth('JWT-auth')
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
