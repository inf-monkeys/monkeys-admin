import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { config } from '../../common/config/index.js';
import { COMMON_COLUMNS } from './columns/index.js';

export class Migartion1718289294622 implements MigrationInterface {
    tableName = `${config.server.appId}_recharge_record`;
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
              name: this.tableName,
              columns: [
                  ...COMMON_COLUMNS,
                  {
                      name: 'team_id',
                      type: 'varchar',
                      length: '255',
                  },
                  {
                      name: 'user_id',
                      type: 'varchar',
                      length: '255',
                  },
                  {
                      name: 'amount',
                      type: 'float',
                  },
                  {
                      name: 'changed_balance',
                      type: 'float',
                  },
                  {
                      name: 'payment_id',
                      type: 'varchar',
                      isNullable: true,
                  },
                  {
                      name: 'remark',
                      type: 'varchar',
                      isNullable: true,
                  },
              ]
          }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName);
    }

}
