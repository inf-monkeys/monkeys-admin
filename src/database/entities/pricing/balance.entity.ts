import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base/base.js';

@Entity({ name: 'balances' })
export class BalanceEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'team_id',
  })
  teamId: string;

  @Column({
    type: 'int8',
    nullable: true,
    name: 'balance',
  })
  balance: number;
}
