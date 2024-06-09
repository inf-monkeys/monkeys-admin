import { BlockCredentialItem, BlockDefProperties, BlockExtraInfo, BlockRuleItem, BlockType } from '@inf-monkeys/vines';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.js';

export enum PricingRule {
  FREE = 'FREE',
  PER_EXECUTR = 'PER_EXECUTR',
  PER_1MIN = 'PER_1MIN',
  PER_1K_TOKEN = 'PER_1K_TOKEN',
}

@Entity({ name: 'tools' })
export class ToolsEntity extends BaseEntity {
  @Column({
    nullable: true,
    name: 'creator_user_id',
  })
  creatorUserId?: string;

  @Column({
    nullable: true,
  })
  teamId?: string;

  @Column({
    nullable: true,
  })
  public?: boolean;

  @Column({
    default: BlockType.SIMPLE,
    type: 'varchar',
  })
  type: BlockType;

  @Column()
  namespace: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
    type: 'simple-json',
  })
  credentials?: BlockCredentialItem[];

  @Column({
    name: 'display_name',
  })
  displayName: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column({
    nullable: true,
    type: 'simple-json',
  })
  categories?: string[];

  @Column({
    nullable: true,
  })
  icon?: string;

  @Column({
    nullable: true,
    comment: '表单配置',
    type: 'simple-json',
  })
  input: BlockDefProperties[];

  @Column({
    nullable: true,
    comment: '输出数据',
    type: 'simple-json',
  })
  output: BlockDefProperties[];

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  rules?: BlockRuleItem[];

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  extra?: BlockExtraInfo;

  @Column({
    nullable: true,
    type: 'varchar',
    name: 'pricing_rule',
    default: PricingRule.FREE,
  })
  pricingRule?: PricingRule;

  @Column({
    nullable: true,
    type: 'float',
    default: 0,
    name: 'unit_price',
  })
  unitPrice?: number;
}
