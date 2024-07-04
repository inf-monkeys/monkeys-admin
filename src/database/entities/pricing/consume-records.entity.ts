import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.js';

export enum ConsumeRecordType {
  EXECUTE_TOOL = 'execute_tool',
}

export interface ConsumeRecordDetails {
  toolName: string;
  workflowId: string;
  workflowInstanceId: string;
  taskId: string;
}

export enum ConsumeRecordStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Entity({ name: 'consume_records' })
export class ConsumeRecordsEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'team_id',
  })
  teamId: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'user_id',
  })
  userId: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'type',
    default: ConsumeRecordType.EXECUTE_TOOL,
  })
  type: ConsumeRecordType;

  @Column({
    name: 'status',
    type: 'varchar',
    default: ConsumeRecordStatus.PENDING,
    length: 50,
  })
  status: ConsumeRecordStatus;

  @Column({
    type: 'float',
    nullable: true,
    name: 'amount',
  })
  amount: number;

  @Column({
    name: 'tool_name',
    type: 'json',
    nullable: true,
  })
  toolName: string;

  @Column({
    name: 'workflow_id',
    type: 'varchar',
    nullable: true,
    length: 128,
  })
  workflowId: string;

  @Column({
    name: 'workflow_instance_id',
    type: 'varchar',
    nullable: true,
    length: 128,
  })
  workflowInstanceId: string;

  @Column({
    name: 'task_id',
    type: 'varchar',
    nullable: true,
    length: 128,
  })
  taskId: string;
}
