import { setSeederFactory } from 'typeorm-extension';
import { Product } from '../../src/modules/product/product.entity';
import { v4 as uuid } from 'uuid';
export default setSeederFactory(Product, async (faker) => {
  const product = new Product();
  product.name = faker.commerce.productName();
  product.slug = uuid();
  product.content = faker.commerce.productDescription();
  product.price = parseInt(faker.commerce.price(0, 10000, 0));
  product.displayImage = faker.image.fashion();
  product.amount = faker.datatype.number({ min: 0, max: 100 });
  return product;
});
