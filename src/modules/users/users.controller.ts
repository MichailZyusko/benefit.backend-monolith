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
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserByIdDto } from "./dto/get-user-by-email.dto";
import { GetUsersDto } from "./dto/get-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { OmitedUser } from "./types";
import { UsersService } from "./users.service";

@ApiTags("Users")
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

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findById(@Param() getUserByIdDto: GetUserByIdDto): Promise<OmitedUser> {
    return await this.userService.findById(getUserByIdDto);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param() getUserByIdDto: GetUserByIdDto
  ): Promise<OmitedUser> {
    return await this.userService.update({
      updateUserDto,
      getUserByIdDto,
    });
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param() getUserByIdDto: GetUserByIdDto): Promise<void> {
    await this.userService.deleteById(getUserByIdDto);
  }
}
