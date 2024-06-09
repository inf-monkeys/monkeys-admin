import { AssetType } from '@inf-monkeys/vines';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.js';

@Entity({ name: 'asset_marketplace_tags' })
export class AssetsMarketPlaceTagEntity extends BaseEntity {
  @Column({
    name: 'asset_type',
    type: 'varchar',
  })
  assetType: AssetType;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  color?: string;

  @Column()
  _pinyin: string;
}
