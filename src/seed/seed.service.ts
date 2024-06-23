import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { HandleError } from 'src/decorators/error-handler.decorator';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  runSeed() {
    return this.insertNewProducts();
  }

  @HandleError()
  private async insertNewProducts() {
    // const initialData = ProductsService.getInitialData();
    // await this.productsService.createMany(initialData);
    await this.productsService.deleteAllProducts();

    const products = initialData.products;
    const insertProductsPromise = [];

    products.forEach((product) => {
      insertProductsPromise.push(this.productsService.create(product));
    });

    await Promise.all(insertProductsPromise);

    return 'Seed Finished';
  }
}
