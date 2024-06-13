import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.js';

@Entity({ name: 'recharge_records' })
export class RechargeRecordsEntity extends BaseEntity {
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
    type: 'float',
    nullable: true,
    name: 'amount',
  })
  remainBalance: number;

  @Column({
    type: 'float',
    nullable: true,
    name: 'changed_balance',
  })
  changedBalance: number;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'payment_id',
  })
  remark?: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'remark',
  })
  paymentId?: string;
}