import { Logger, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { ErrorHandlerModule } from 'src/error-handler/error-handler.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, Logger],
  imports: [ErrorHandlerModule, TypeOrmModule.forFeature([Product])],
})
export class ProductsModule {}
