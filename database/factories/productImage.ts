import { setSeederFactory } from 'typeorm-extension';
import { Image } from '../../src/modules/product/product.entity';
export default setSeederFactory(Image, async (faker) => {
  const image = new Image();
  image.path = faker.image.fashion();
  return image;
});
