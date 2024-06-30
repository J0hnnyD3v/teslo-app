import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Men’s Chill Crew Neck Sweatshirt',
    description: 'Product title',
    minLength: 5,
    maxLength: 255,
    uniqueItems: true,
  })
  @IsString()
  @Length(5, 255)
  title: string;

  @ApiProperty({ example: 1.99, description: 'Product price', required: false, default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    example:
      // eslint-disable-next-line max-len
      'Introducing the Tesla Chill Collection. The Men’s Chill Crew Neck Sweatshirt has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The sweatshirt features a subtle thermoplastic polyurethane T logo on the chest and a Tesla wordmark below the back collar. Made from 60% cotton and 40% recycled polyester.',
    description: 'Product description',
    required: false,
    default: null,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'mens_chill_crew_neck_sweatshirt',
    description: 'Product slug',
    required: false,
    uniqueItems: true,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 100, description: 'Product stock', required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    type: [String],
    example: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Product sizes',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  sizes: string[];

  @ApiProperty({ example: 'men', description: 'Product gender', enum: ['women', 'men', 'kid', 'unisex'] })
  @IsIn(['women', 'men', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({
    type: [String],
    example: ['sweatshirt'],
    description: 'Product tags',
    required: false,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  images?: string[];
}
