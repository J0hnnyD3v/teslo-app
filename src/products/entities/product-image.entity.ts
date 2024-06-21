import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('text')
  url: string;
}
