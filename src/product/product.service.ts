import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, TreeChildren } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUuid } from "uuid";
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ){

  }

  async create(createProductDto: CreateProductDto) {
    try {

      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( image => this.productImagesRepository.create({  url: image }))
      });

      console.log({product})
      await this.productRepository.save( product );

      return {... product, images: images };
      
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
        relations: {
          images: true
        }
      });
      return products.map( product => ({
        ...product,
        images: product.images.map( img => img.url )
      }));

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
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product =  await queryBuilder
      .where('UPPER(title) =:title or slug =:slug',{
        title: term.toUpperCase(),
        slug: term.toLocaleLowerCase(),
      })
      .leftJoinAndSelect('prod.images','prodImages')
      .getOne();
    }
      // const product = await this.productRepository.findOneBy({ id })

      if(!product) {
        throw new NotFoundException(`Product not found by id ${ term }`);
      }
      
      return product;

  }

  async findOnePlain( term: string){
    const { images = [], ...rest } = await this.findOne( term );
    return {
      ...rest,
      images: images.map( image => image.url )
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const { images, ...toUpdate } = updateProductDto;

    //? preload: busca el producto con el id y luego le carga los valores del dto
    const product = await this.productRepository.preload({  id, ...toUpdate });

    if( !product ) throw new NotFoundException(`Product whith id: ${ id } not found`)

    //? Create query ruuner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
 
    try {

      if( images ){
        await queryRunner.manager.delete( ProductImage, { product: { id }});

        product.images = images.map(
          image => this.productImagesRepository.create({ url: image }));
      }else{

      }

      await  queryRunner.manager.save( product );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain( id );
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release(),
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

  async deleteAllProducts(){
    
    const query = this.productRepository.createQueryBuilder('product');

    try {

      return await query
        .delete()
        .where({})
        .execute();
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
