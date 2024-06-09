import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { config } from '../../common/config/index.js';
import { COMMON_COLUMNS } from './columns/index.js';

const appId = config.server.appId;

export class MigartionAddTableBalance1717914253848 implements MigrationInterface {
  tableName = `${appId}_balances`;
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
            name: 'balance',
            type: 'int8',
            comment: 'The balance of the team',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
