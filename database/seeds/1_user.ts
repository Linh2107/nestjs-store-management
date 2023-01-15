import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../src/modules/user/user.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // const repository = dataSource.getRepository(User);
    // await repository.insert([
    //   {
    //     name: 'Test User',
    //     email: 'test@gmail.com',
    //     pass: 'caleb.barrows@gmail.com',
    //   },
    // ]);
    // ---------------------------------------------------

    const userFactory = await factoryManager.get(User);
    // save 1 factory generated entity, to the database
    await userFactory.save({
      name: 'Linhhhh',
      email: 'linh@gmail.com',
    });

    // save 5 factory generated entities, to the database
    await userFactory.saveMany(5);
  }
}
