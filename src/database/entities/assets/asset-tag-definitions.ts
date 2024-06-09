import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.js';

@Entity({ name: 'asset_tags' })
export class AssetsTagEntity extends BaseEntity {
  @Column({
    name: 'team_id',
  })
  teamId: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  color?: string;

  @Column()
  _pinyin: string;
}
