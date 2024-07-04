import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.js';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  DELIVERED = 'delivered',
  CLOSED = 'closed',
}

@Entity({ name: 'orders' })
export class OrdersEntity extends BaseEntity {
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
    name: 'platform',
  })
  platform: string;

  @Column({
    name: 'amount',
    type: 'float',
  })
  amount: number;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'status',
  })
  status: PaymentStatus;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'qrcode',
  })
  qrcode?: string;
}
