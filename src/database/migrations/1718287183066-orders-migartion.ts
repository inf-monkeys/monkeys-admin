import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { config } from '../../common/config/index.js';
import { COMMON_COLUMNS } from './columns/index.js';

export class MigartionOrders1718287183066 implements MigrationInterface {
    tableName = `${config.server.appId}_orders`;
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
                      name: 'type',
                      type: 'varchar',
                      length: '255',
                  },
                  {
                      name: 'status',
                      type: 'varchar',
                  },
                  {
                      name: 'amount',
                      type: 'float',
                  },
                  {
                      name: 'qrcode',
                      type: 'varchar',
                      isNullable: true,
                  },
              ],
          }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName);
    }

}
