import { setSeederFactory } from 'typeorm-extension';
import { Store } from '../../src/modules/store/store.entity';
import { v4 as uuid } from 'uuid';
export default setSeederFactory(Store, async (faker) => {
  console.log('store factory');

  const store = new Store();
  store.name = faker.company.name();
  store.slug = uuid();
  store.logo = faker.image.business();
  store.address = faker.address.streetAddress(true);
  return store;
});
