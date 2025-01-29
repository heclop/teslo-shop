import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUuid } from "uuid";
import { title } from 'process';

@Injectable()
export class ProductService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){

  }

  async create(createProductDto: CreateProductDto) {
    try {

      const product = this. productRepository.create( createProductDto );
      await this.productRepository.save( product );

      return product;
      
    } catch ( error ) {
      
      this.handleDBExceptions( error );
    }
  }

  async findAll( paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    try {

      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        //TODO: Relaciones
      });
      return products;

    } catch (error) {
      this.handleDBExceptions( error );
    }
  }

  async findOne(term: string) {

    let product: Product;
    
    if( isUuid( term )){
      product = await this.productRepository.findOneBy({ id: term })
    }else{
      // product = await this.productRepository.findOneBy({ slug: term })
      const queryBuilder = this.productRepository.createQueryBuilder();
      product =  await queryBuilder
      .where('UPPER(title) =:title or slug =:slug',{
        title: term.toUpperCase(),
        slug: term.toLocaleLowerCase(),
      }).getOne();
    }
      // const product = await this.productRepository.findOneBy({ id })

      if(!product) {
        throw new NotFoundException(`Product not found by id ${ term }`);
      }
      
      return product;

  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    

    //? preload: busca el producto con el id y luego le carga los valores del dto
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if( !product ) throw new NotFoundException(`Product whith id: ${ id } not found`)

    try {

      await this.productRepository.save( product );
      return product;
      
    } catch (error) {
      this.handleDBExceptions(error)
    }


  }

 async remove(id: string) {
    
    const product = await this.findOne( id );

    await this.productRepository.remove( product );

    return;
  }

  private handleDBExceptions( error: any){

    if( error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
      throw new InternalServerErrorException(', check server logs')
  }
}
