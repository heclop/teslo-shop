import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from 'src/auth/entities/user.entity';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Auth()
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productService.create(createProductDto, user );
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto) {
    console.log({paginationDto});
    return this.productService.findAll( paginationDto );
  }

  @Get(':term')
  findOne(@Param('term',  ) term: string) {
    return this.productService.findOnePlain(term);
  }

  @Auth( ValidRoles.admin )
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {
    return this.productService.update(id, updateProductDto, user );
  }

  @Auth( ValidRoles.admin )
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe ) id: string) {
    return this.productService.remove(id);
  }
}
