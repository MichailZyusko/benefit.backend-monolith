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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserByIdDto } from "./dto/get-user-by-id.dto";
import { GetUsersDto } from "./dto/get-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { OmitedUser } from "./types";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: "Something went wrong",
})
@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Returns an array of users",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Success" })
  async findAll(@Query() getUsersDto: GetUsersDto): Promise<OmitedUser[]> {
    return await this.userService.findAll(getUsersDto);
  }

  @Post()
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
  async create(@Body() createUserDto: CreateUserDto): Promise<OmitedUser> {
    return await this.userService.create(createUserDto);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Returns the user by its id",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Success" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  async findById(@Param() getUserByIdDto: GetUserByIdDto): Promise<OmitedUser> {
    return await this.userService.findById(getUserByIdDto);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      "Updates the user according to the parameters passed in the request body",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Success" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
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
  @ApiOperation({
    summary: "Deletes a user by its id",
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "Success" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found",
  })
  async deleteById(@Param() getUserByIdDto: GetUserByIdDto): Promise<void> {
    await this.userService.deleteById(getUserByIdDto);
  }
}
