import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../src/modules/user/user.entity';
import * as bcrypt from 'bcrypt';

export default setSeederFactory(User, async (faker) => {
  console.log('factory');
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash('123456', salt);

  const user = new User();
  user.name = faker.name.firstName();
  user.email = faker.internet.email();
  user.password = hash;
  // user.avatar = faker.image.avatar();
  return user;
});
