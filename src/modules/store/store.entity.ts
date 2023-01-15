import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Entity('stores')
export class Store extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar')
  name: string;
  @Column({ type: 'varchar', unique: true })
  slug: string;
  @Column({ type: 'varchar', nullable: true })
  logo: string;
  @Column({ type: 'varchar', nullable: true })
  address: string;
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column('integer')
  userId: number;

  @ManyToOne(() => User, (user) => user.stores, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
