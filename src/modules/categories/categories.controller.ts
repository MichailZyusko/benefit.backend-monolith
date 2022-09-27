import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CreateCategoriesDto } from "./dto/create-category.dto";
import { GetCategoriesDto } from "./dto/get-categories.dto";
import { OmitedCategory } from "./types";

@ApiTags("Categories")
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: "Something went wrong",
})
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Returns an array of subcategories of the selected category",
  })
  @ApiResponse({ status: HttpStatus.OK, description: "Success" })
  async findAll(
    @Query() getCategoriesDto: GetCategoriesDto
  ): Promise<OmitedCategory[]> {
    return await this.categoryService.findAll(getCategoriesDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      "Creates the category according to the parameters passed in the body of the request",
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Success" })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Category already exists",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category with spesific parent_id not found",
  })
  async create(
    @Body() createCategoriesDto: CreateCategoriesDto
  ): Promise<OmitedCategory> {
    return await this.categoryService.create(createCategoriesDto);
  }
}
