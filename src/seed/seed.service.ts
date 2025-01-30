import { ProductService } from './../product/product.service';
import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {

  constructor(private readonly productService: ProductService){

  }

  async runSeed(){

    await this.insertNewProducts();

    return 'SEED EXECUTED';
  }

  private async insertNewProducts(){

    await this.productService.deleteAllProducts();

    const products =  initialData.products;

    const insertPromise = [];

    products.forEach( product => {
      insertPromise.push( this.productService.create( product ));
    });

    await Promise.all( insertPromise );

    return;
  }
}
