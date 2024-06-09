import { AssetType } from '@inf-monkeys/vines';
import { Column, Entity } from 'typeorm';
import { TargetType } from '../../../common/typings/common.js';
import { BaseEntity } from '../base/base.js';

export interface AssetFilterRule {
  createdTimestamp?: [number, number];
  updatedTimestamp?: [number, number];
  tagIds?: string[];
  userIds?: string[];
}

@Entity({ name: 'assets_authorization' })
export class AssetsAuthorizationEntity extends BaseEntity {
  @Column({
    name: 'asset_type',
    type: 'varchar',
  })
  assetType: AssetType;

  @Column({
    name: 'asset_id',
    type: 'varchar',
  })
  assetId: string;

  @Column({
    name: 'target_type',
    type: 'varchar',
  })
  targetType: TargetType;

  @Column({
    name: 'target_id',
    type: 'varchar',
  })
  targetId: string;
}
