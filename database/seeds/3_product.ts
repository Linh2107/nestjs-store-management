import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Product } from '../../src/modules/product/product.entity';
import { Store } from '../../src/modules/store/store.entity';
export default class ProductSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const storeRepository = dataSource.getRepository(Store);
    const stores = await storeRepository.find();

    const productFactory = await factoryManager.get(Product);

    for (const store of stores) {
      await productFactory.saveMany(15, { store: store });
    }
  }
}
