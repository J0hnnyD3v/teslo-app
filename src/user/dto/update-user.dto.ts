import { IsDate, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { BaseUserDto } from '.';

export class UpdateUserDto extends PartialType(BaseUserDto) {
  @IsDate()
  @IsOptional()
  updatedAt: Date;
}
