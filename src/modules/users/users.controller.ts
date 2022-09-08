import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserByEmailDto } from "./dto/get-user-by-email.dto";
import { GetUsersDto } from "./dto/get-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { OmitedUser } from "./types";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() getUsersDto: GetUsersDto): Promise<OmitedUser[]> {
    return await this.userService.findAll(getUsersDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<OmitedUser> {
    return await this.userService.create(createUserDto);
  }

  @Get(":email")
  @HttpCode(HttpStatus.OK)
  async findByEmail(
    @Param() getUserByEmailDto: GetUserByEmailDto
  ): Promise<OmitedUser> {
    return await this.userService.findByEmail(getUserByEmailDto);
  }

  @Put(":email")
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param() getUserByEmailDto: GetUserByEmailDto
  ): Promise<OmitedUser> {
    return await this.userService.update({
      updateUserDto,
      getUserByEmailDto,
    });
  }

  @Delete(":email")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByEmail(
    @Param() getUserByEmailDto: GetUserByEmailDto
  ): Promise<void> {
    await this.userService.deleteByEmail(getUserByEmailDto);
  }
}
