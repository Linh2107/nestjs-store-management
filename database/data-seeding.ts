import { runSeeders } from 'typeorm-extension';
import dataSource from './data-source';
(async () => {
  await dataSource.initialize();

  await runSeeders(dataSource, {
    seeds: ['dist/database/seeds/*.js'],
    factories: ['dist/database/factories/*.js'],
  });
  process.exit(1);
})();
