import { DataSourceOptions } from 'typeorm';

import { config } from '../common/config/index.js';
import { AssetsAuthorizationEntity } from './entities/assets/asset-authorization.js';
import { AssetFilterEntity } from './entities/assets/asset-filter.js';
import { AssetsMarketplaceTagRelationsEntity } from './entities/assets/asset-marketplace-tag-relations.js';
import { AssetsMarketPlaceTagEntity } from './entities/assets/asset-marketplace-tag.js';
import { AssetsTagEntity } from './entities/assets/asset-tag-definitions.js';
import { AssetsTagRelationsEntity } from './entities/assets/asset-tag-relations.js';
import { SqlKnowLedgeBaseEntity } from './entities/assets/knowledge-base/knowledge-base-sql.entity.js';
import { KnowLedgeBaseEntity } from './entities/assets/knowledge-base/knowledge-base.entity.js';
import { MediaFileEntity } from './entities/assets/media/media-file.js';
import { LlmModelEntity } from './entities/assets/model/llm-model/llm-model.js';
import { SdModelEntity } from './entities/assets/model/sd-model/sd-model.js';
import { TeamEntity } from './entities/identity/team.js';
import { UserEntity } from './entities/identity/user.js';
import { ToolsServerEntity } from './entities/tools/tools-server.entity.js';
import { ToolsEntity } from './entities/tools/tools.entity.js';
import { WorkflowMetadataEntity } from './entities/workflow/workflow-metadata.js';
import { WorkflowTemplateEntity } from './entities/workflow/workflow-template.js';
import { WorkflowTriggersEntity } from './entities/workflow/workflow-trigger.js';
import { BalanceEntity } from './entities/pricing/balance.entity.js';
import { ConsumeRecordsEntity } from './entities/pricing/consume-records.entity.js';

const typeOrmConfig: DataSourceOptions = {
  ...config.database,
  entityPrefix: config.server.appId.concat('_'),
  entities: [
    UserEntity,
    TeamEntity,
    ToolsServerEntity,
    ToolsEntity,
    SqlKnowLedgeBaseEntity,
    KnowLedgeBaseEntity,
    MediaFileEntity,
    LlmModelEntity,
    SdModelEntity,
    AssetsAuthorizationEntity,
    AssetFilterEntity,
    AssetsMarketPlaceTagEntity,
    AssetsMarketPlaceTagEntity,
    AssetsMarketplaceTagRelationsEntity,
    AssetsTagEntity,
    AssetsTagRelationsEntity,
    WorkflowMetadataEntity,
    WorkflowTemplateEntity,
    WorkflowTriggersEntity,
    BalanceEntity,
    ConsumeRecordsEntity,
  ],
};

export default typeOrmConfig;
