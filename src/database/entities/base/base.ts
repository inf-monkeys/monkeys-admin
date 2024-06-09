import { Column, PrimaryColumn, BaseEntity as TypeOrmBaseEntity } from 'typeorm';

export class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 128,
  })
  id: string;

  @Column({
    name: 'created_timestamp',
    default: Date.now(),
    type: 'bigint',
  })
  createdTimestamp: number;

  @Column({
    name: 'updated_timestamp',
    default: Date.now(),
    type: 'bigint',
  })
  updatedTimestamp: number;

  @Column({ default: false, name: 'is_deleted' })
  isDeleted?: boolean;
}
