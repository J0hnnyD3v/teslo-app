import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HandleError } from 'src/decorators/error-handler.decorator';
import { ProductsService } from 'src/products/products.service';

import { User } from 'src/user/entities/user.entity';

import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  private _saltOrRounds = 10;

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const user = await this.insertNewUsers();

    return this.insertNewProducts(user);
  }

  @HandleError()
  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  @HandleError()
  private async insertNewUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach(async (user) => {
      users.push(this.userRepository.create(user));
    });

    const insertedUsers = await this.userRepository.save(users);
    return insertedUsers[0];
  }

  @HandleError()
  private async insertNewProducts(user: User) {
    const products = initialData.products;
    const insertProductsPromise = [];

    products.forEach((product) => {
      insertProductsPromise.push(this.productsService.create(product, user));
    });

    await Promise.all(insertProductsPromise);

    return 'Seed Finished';
  }
}
