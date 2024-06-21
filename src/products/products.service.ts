import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';
import { HandleError } from 'src/decorators/error-handler.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  @HandleError()
  async create(createProductDto: CreateProductDto) {
    const { images = [], ...productDetails } = createProductDto;
    const product = this.productsRepository.create({
      ...productDetails,
      images: images.map((img) => this.productImageRepository.create({ url: img })),
    });
    await this.productsRepository.save(product);
    return { product };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });
    return { products };
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');

    return { product };
  }

  async search(searchTerm: string) {
    let product: Product;
    if (isUUID(searchTerm)) {
      product = await this.productsRepository.findOneBy({ id: searchTerm });
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('LOWER(title) =:title OR slug =:slug', {
          title: searchTerm.toLowerCase(),
          slug: searchTerm,
        })
        .leftJoinAndSelect('product.images', 'images')
        .getOne();
    }
    if (!product) throw new NotFoundException('Product not found');

    return { product };
  }

  @HandleError()
  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.preload({
      id,
      ...updateProductDto,
      images: [],
    });
    if (!product) throw new NotFoundException('Product not found');
    await this.productsRepository.save(product);
    return { product };
  }

  @HandleError()
  async remove(id: string) {
    const { product } = await this.findOne(id);
    await this.productsRepository.remove(product);
  }
}
