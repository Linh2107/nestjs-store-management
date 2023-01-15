import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from '../store/store.entity';
@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar')
  name: string;
  @Column({ type: 'varchar', unique: true })
  slug: string;
  @Column('text')
  content: string;
  @Column('integer')
  price: number;
  @Column('integer')
  amount: number;
  @Column('varchar')
  displayImage: string;

  @Column('integer')
  storeId: number;
  @ManyToOne(() => Store, (store) => store.products, { nullable: false })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}

@Entity('product_images')
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  productId: number;

  @Column({ type: 'varchar', nullable: false })
  path: string;

  @ManyToOne(() => Product, (product) => product.images, { nullable: false })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
