import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { config } from '../../common/config/index.js';
import { COMMON_COLUMNS } from './columns/index.js';

export class MigartionAddTableConsumeRecords1717914395033 implements MigrationInterface {
  tableName = `${config.server.appId}_consume_records`;
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
            length: '50',
          },
          {
            name: 'amount',
            type: 'float',
          },
          {
            name: 'tool_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'workflow_id',
            type: 'varchar',
            length: '128',
            isNullable: true,
          },
          {
            name: 'workflow_instance_id',
            type: 'varchar',
            length: '128',
            isNullable: true,
          },
          {
            name: 'task_id',
            type: 'varchar',
            length: '128',
            isNullable: true,
          },
        ],
        indices: [
          {
            columnNames: ['team_id'],
          },
          {
            columnNames: ['user_id'],
          },
          {
            columnNames: ['workflow_id'],
          },
          {
            columnNames: ['workflow_instance_id'],
          },
          {
            columnNames: ['task_id'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
