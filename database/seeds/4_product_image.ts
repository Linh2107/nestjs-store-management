import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Product, Image } from '../../src/modules/product/product.entity';
export default class StoreSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const productRepository = dataSource.getRepository(Product);
    const products = await productRepository.find();

    const proudctImageFactory = await factoryManager.get(Image);

    for (const product of products) {
      await proudctImageFactory.saveMany(5, { product });
    }
  }
}
