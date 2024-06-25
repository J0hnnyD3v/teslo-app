import { Module } from '@nestjs/common';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { ProductsModule } from 'src/products/products.module';
import { ErrorHandlerModule } from 'src/error-handler/error-handler.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule, ErrorHandlerModule, AuthModule, UserModule],
})
export class SeedModule {}
