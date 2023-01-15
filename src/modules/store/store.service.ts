import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverPackageNotInstalledError, Repository } from 'typeorm';
import { Store } from './store.entity';
import { StoreDto, StoreFilterDto } from './store.dto';
import { v4 as uuid } from 'uuid';
import { User } from '../user/user.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { PER_PAGE } from '../../contants';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store) private readonly repository: Repository<Store>,
  ) {}

  findAll(query: StoreFilterDto, user): Promise<Pagination<Store>> {
    const paginateOptions: IPaginationOptions = {
      page: query.page || 1,
      limit: query.limit || PER_PAGE,
    };

    const queryBuilder = this.repository
      .createQueryBuilder('s')
      .where('s.userId = :userId', { userId: user.id });

    if (query.name) {
      queryBuilder.where('p.name LIKE :name', { name: `%${query.name}%` });
    }

    return paginate<Store>(queryBuilder, paginateOptions);
  }

  async findOne(condition, relations = []): Promise<Store> {
    console.log(condition);
    const store = await this.repository.findOne({
      where: condition,
      relations: relations,
    });
    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }
    return store;
  }

  async create(dto: StoreDto, user: User): Promise<Store> {
    const slug = uuid();
    try {
      const newStore = this.repository.create({
        ...dto,
        slug,
        userId: user.id,
      });
      return this.repository.save(newStore);
    } catch (err) {
      throw new HttpException('SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, dto: StoreDto, user: User): Promise<Store> {
    const store = await this.findOne({ id, userId: user.id });
    try {
      const newStore = { ...store, ...dto };
      return this.repository.save(newStore);
    } catch (err) {
      throw new HttpException('SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id, user: User): Promise<boolean> {
    const store = await this.findOne({ id, userId: user.id });
    try {
      await this.repository.softDelete(store.id);
      return true;
    } catch (err) {
      throw new HttpException('SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
