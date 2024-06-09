import { AssetType } from '@inf-monkeys/vines';
import { Column, Entity } from 'typeorm';
import { BaseAssetEntity } from '../base-asset.js';

export enum KnowledgeBaseRetrievalMode {
  VectorSearch = 'vector-search',
  FullTextSearch = 'fulltext-search',
}

export interface KnowledgeBaseRetrievalSettings {
  mode: KnowledgeBaseRetrievalMode;
  topK: number;
  scoreThreshHold?: number;
}

@Entity({ name: 'knowledge_bases' })
export class KnowLedgeBaseEntity extends BaseAssetEntity {
  assetType: AssetType = 'knowledge-base';

  @Column({})
  uuid: string;

  @Column({
    name: 'embedding_model',
  })
  embeddingModel: string;

  @Column()
  dimension: number;

  @Column({
    name: 'retrieval_settings',
    nullable: true,
    type: 'simple-json',
  })
  retrievalSettings: KnowledgeBaseRetrievalSettings;

  public getRetrievalSettings(): KnowledgeBaseRetrievalSettings {
    return (
      this.retrievalSettings || {
        mode: KnowledgeBaseRetrievalMode.VectorSearch,
        topK: 3,
      }
    );
  }
}
