import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { config } from '../../common/config/index.js';
import { isColumnExist } from './utils/index.js';
import { VARCHAR } from './columns/index.js';

const appId = config.server.appId;

export class MigartionAddPricingColumnForTools1717912951866 implements MigrationInterface {
  TABLE_NAME = `${appId}_tools`;
  PRICING_COLUMN_NAME = 'pricing_rule';
  UNIT_PRICE_COLUMN_NAME = 'unit_price';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const pricingRuleColumnExists = await isColumnExist(this.PRICING_COLUMN_NAME, this.TABLE_NAME, queryRunner);
    if (!pricingRuleColumnExists) {
      await queryRunner.addColumn(
        this.TABLE_NAME,
        new TableColumn({
          name: this.PRICING_COLUMN_NAME,
          comment: '定价规则',
          ...VARCHAR,
          isNullable: true,
          default: "'FREE'",
        }),
      );
    }

    const unitPriceColumnExists = await isColumnExist(this.UNIT_PRICE_COLUMN_NAME, this.TABLE_NAME, queryRunner);
    if (!unitPriceColumnExists) {
      await queryRunner.addColumn(
        this.TABLE_NAME,
        new TableColumn({
          name: this.UNIT_PRICE_COLUMN_NAME,
          comment: '单价',
          type: 'float',
          isNullable: true,
          default: 0,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.TABLE_NAME, this.PRICING_COLUMN_NAME);
    await queryRunner.dropColumn(this.TABLE_NAME, this.UNIT_PRICE_COLUMN_NAME);
  }
}
