import { Module } from '@nestjs/common';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { ProductsModule } from 'src/products/products.module';
import { ErrorHandlerModule } from 'src/error-handler/error-handler.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule, ErrorHandlerModule],
})
export class SeedModule {}
