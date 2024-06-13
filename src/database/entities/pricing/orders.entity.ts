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
    name: 'type'
  })
  platform: string;

  @Column({
    name: 'status',
    type: 'float',
  })
  amount: number;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'amount',
  })
  status: PaymentStatus;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'payload',
  })
  qrcode?: string;
}