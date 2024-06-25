import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ErrorHandlerModule } from 'src/error-handler/error-handler.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [ErrorHandlerModule, TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
