import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Store } from '../../src/modules/store/store.entity';
import { User } from '../../src/modules/user/user.entity';
export default class StoreSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const users = await userRepository.find();

    const storeFactory = await factoryManager.get(Store);

    for (const user of users) {
      await storeFactory.saveMany(5, { user: user });
    }
  }
}
