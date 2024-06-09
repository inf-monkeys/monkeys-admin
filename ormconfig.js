import yaml from 'yaml';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

const isProd = existsSync('./dist');

const migrationsDir = isProd ? `./dist/database/migrations/*.js` : `./src/database/migrations/*.ts`;
const entitiesDir = isProd ? `./dist/database/entities/**/*.js` : `./src/database/entities/**/*.js`;

let rawConfigs = [];
if (process.env.MONKEYS_CONFIG_FILE) {
  console.log('Using MONKEYS_CONFIG_FILE:', process.env.MONKEYS_CONFIG_FILE);
  rawConfigs = [resolve(process.env.MONKEYS_CONFIG_FILE)];
} else {
  rawConfigs = [resolve('/etc/monkeys-admin/config.yaml'), resolve('./config.yaml')];
}
rawConfigs = rawConfigs
  .filter(Boolean)
  .filter(existsSync)
  .map((file) => readFileSync(file, 'utf-8'))
  .map((content) => yaml.parse(content));
const config = [...rawConfigs].reduce((prev, curr) => {
  return _.merge(prev, curr);
});

const appId = config.server.appId || 'monkeys';
console.log('Run migration for appId: ', appId);
const dataSource = new DataSource({
  ...config.database,
  entityPrefix: appId.concat('_'),
  migrations: [migrationsDir],
  entities: [entitiesDir],
  migrationsTableName: `${appId}_migrations`,
});
dataSource.initialize();

export default dataSource
