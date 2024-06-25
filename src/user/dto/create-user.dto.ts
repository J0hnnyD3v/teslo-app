import { IsDate, IsOptional } from 'class-validator';
import { BaseUserDto } from '.';

export class CreateUserDto extends BaseUserDto {
  @IsDate()
  @IsOptional()
  createdAt: Date;
}
