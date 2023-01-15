import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DataSource, Repository } from 'typeorm';
import { Product, Image } from './product.entity';
import { PER_PAGE } from '../../contants';
import { ProductDto, ProductFilterDto, ProductImageDto } from './product.dto';
import { User } from '../user/user.entity';
import { v4 as uuid } from 'uuid';
// import {
//   pagi
// }
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: ProductFilterDto, user): Promise<Pagination<Product>> {
    const paginateOptions: IPaginationOptions = {
      page: query.page || 1,
      limit: query.limit || PER_PAGE,
    };

    const queryBuilder = this.repository
      .createQueryBuilder('p')
      .leftJoin('p.store', 'store')
      .where('store.userId = :userId', { userId: user.id });

    if (query.name) {
      queryBuilder.andWhere('p.name LIKE :name', { name: `%${query.name}%` });
    }
    if (query.minPrice) {
      queryBuilder.andWhere('p.price >= :minPrice', {
        minPrice: query.minPrice,
      });
    }
    if (query.maxPrice) {
      queryBuilder.andWhere('p.price <= :maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    return paginate(queryBuilder, paginateOptions);
  }

  async findOne(condition, relations = []): Promise<Product> {
    const product = await this.repository.findOne({
      where: condition,
      relations: relations,
    });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async create(dto: ProductDto, files: any, user: User) {
    if (!files?.displayImage) {
      throw new HttpException(
        'You need to upload displayImage',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (!files?.images) {
      throw new HttpException(
        'You need to upload images',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const slug = uuid();
      dto.displayImage = files.displayImage[0].path;
      const newProduct = queryRunner.manager
        .getRepository(Product)
        .create({ ...dto, slug });
      const product = await queryRunner.manager
        .getRepository(Product)
        .save(newProduct);
      const imagesDto: ProductImageDto = files.images.map((img) => {
        return {
          productId: product.id,
          path: img.path,
        };
      });
      const newImages = queryRunner.manager
        .getRepository(Image)
        .create(imagesDto);
      const images = await queryRunner.manager
        .getRepository(Image)
        .save(newImages);

      product.images = [images];
      await queryRunner.commitTransaction();
      return product;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException('SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, dto: ProductDto, files: any, user: User) {
    const product = await this.findOne({ id, store: { userId: user.id } }, [
      'images',
    ]);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const displayImage = files?.displayImage[0]?.path;
      if (displayImage) {
        dto.displayImage = displayImage;
      }
      const result = await queryRunner.manager
        .getRepository(Product)
        .save({ ...product, ...dto });

      if (files?.images?.length) {
        const imagesDto: ProductImageDto = files.images.map((img) => {
          return {
            productId: id,
            path: img.path,
          };
        });
        const newImages = queryRunner.manager
          .getRepository(Image)
          .create(imagesDto);
        const images = await queryRunner.manager
          .getRepository(Image)
          .save(newImages);
        result.images.concat(newImages);
      }
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new HttpException('SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number, user: User) {
    const product = await this.findOne({ id, store: { userId: user.id } });
    try {
      await this.repository.softDelete(product.id);
      return true;
    } catch (err) {
      console.log(err);
      throw new HttpException('ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
