import * as AdminJSTypeorm from '@adminjs/typeorm';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import AdminJS from 'adminjs';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { config } from './common/config/index.js';
import { SqlKnowLedgeBaseEntity } from './database/entities/assets/knowledge-base/knowledge-base-sql.entity.js';
import { KnowLedgeBaseEntity } from './database/entities/assets/knowledge-base/knowledge-base.entity.js';
import { MediaFileEntity } from './database/entities/assets/media/media-file.js';
import { TeamEntity } from './database/entities/identity/team.js';
import { UserEntity } from './database/entities/identity/user.js';
import { ToolsServerEntity } from './database/entities/tools/tools-server.entity.js';
import { ToolsEntity } from './database/entities/tools/tools.entity.js';
import { WorkflowMetadataEntity } from './database/entities/workflow/workflow-metadata.js';
import { WorkflowTriggersEntity } from './database/entities/workflow/workflow-trigger.js';
import { PaymentModule } from './modules/payment/payment.module.js';
import { CommonMiddleware } from './common/middlewares/common.middleware.js';
import { DatabaseModule } from './database/database.module.js';
import { BalanceEntity } from './database/entities/pricing/balance.entity.js';
import { ConsumeRecordsEntity } from './database/entities/pricing/consume-records.entity.js';
import { OrdersEntity } from './database/entities/pricing/orders.entity.js';
import { RechargeRecordsEntity } from './database/entities/pricing/recharge-record.entity.js';

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database,
});

const { defaultAdmin, enabled: authEnabled } = config.auth;

const authenticate = async (email: string, password: string) => {
  if (email === defaultAdmin.email && password === defaultAdmin.password) {
    return Promise.resolve(defaultAdmin);
  }
  return null;
};

@Module({
  imports: [
    DatabaseModule,
    PaymentModule,
    // AdminJS version 7 is ESM-only. In order to import it, you have to use dynamic imports.
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: () => ({
          adminJsOptions: {
            rootPath: '/admin',
            branding: {
              logo: config.server.customization.logo.light,
              companyName: config.server.customization.title,
              favicon: config.server.customization.favicon.light,
              softwareBrothers: false,
            },
            resources: [
              {
                resource: BalanceEntity,
                options: {
                  id: 'Balances',
                  parent: {
                    name: 'Pricing',
                    icon: 'DollarSign',
                  },
                  sort: {
                    direction: 'desc',
                  },
                },
              },
              {
                resource: ConsumeRecordsEntity,
                options: {
                  id: 'Consume Records',
                  parent: {
                    name: 'Pricing',
                    icon: 'DollarSign',
                  },
                  sort: {
                    direction: 'desc',
                  },
                },
              },
              {
                resource: OrdersEntity,
                options: {
                  id: 'Orders',
                  parent: {
                    name: 'Pricing',
                    icon: 'DollarSign',
                  },
                  sort: {
                    direction: 'desc',
                  },
                },
              },
              {
                resource: RechargeRecordsEntity,
                options: {
                  id: 'Recharge Records',
                  parent: {
                    name: 'Pricing',
                    icon: 'DollarSign',
                  },
                  sort: {
                    direction: 'desc',
                  },
                },
              },
              {
                resource: UserEntity,
                options: {
                  id: 'Users',
                  parent: {
                    name: 'Identity',
                    // use react-feather icon
                    icon: 'User',
                  },
                  sort: {
                    direction: 'desc',
                  },
                },
              },
              {
                resource: TeamEntity,
                options: {
                  id: 'Teams',
                  parent: {
                    name: 'Identity',
                    icon: 'User',
                  },
                  sort: {
                    direction: 'desc',
                  },
                },
              },
              {
                resource: ToolsEntity,
                options: {
                  id: 'Tools',
                  parent: {
                    name: 'Tools',
                    icon: 'Tool',
                  },
                  sort: {
                    direction: 'desc',
                  },
                  listProperties: ['displayName', 'description', 'icon', 'type', 'namespace', 'name'],
                  // actions: {
                  //   Pricing: {
                  //     icon: 'Tool',
                  //     name: 'Pricing',
                  //     actionType: 'record',
                  //     component: Components.ConfigureToolsPricing,
                  //     handler: (request, response, context) => {
                  //       const { record, currentAdmin } = context;
                  //       return {
                  //         record: record.toJSON(currentAdmin),
                  //         msg: 'Hello world',
                  //       };
                  //     },
                  //   },
                  // },
                },
              },
              {
                resource: ToolsServerEntity,
                options: {
                  id: 'Tools Server',
                  parent: {
                    name: 'Tools',
                    icon: 'Tool',
                  },
                  sort: {
                    direction: 'desc',
                  },
                },
              },
              {
                resource: WorkflowMetadataEntity,
                options: {
                  id: 'Workflows',
                  parent: {
                    name: 'Workflows',
                    icon: 'GitMerge',
                  },
                  sort: {
                    direction: 'desc',
                  },
                },
              },
              {
                resource: WorkflowTriggersEntity,
                options: {
                  id: 'Workflow Triggers',
                  parent: {
                    name: 'Workflows',
                    icon: 'GitMerge',
                  },
                  sort: {
                    direction: 'desc',
                  },
                },
              },
              {
                resource: KnowLedgeBaseEntity,
                options: {
                  id: 'Knowledge Base',
                  parent: {
                    name: 'Assets',
                    icon: 'Database',
                  },
                  sort: {
                    direction: 'desc',
                  },
                },
              },
              {
                resource: SqlKnowLedgeBaseEntity,
                options: {
                  id: 'SQL Knowledge Base',
                  parent: {
                    name: 'Assets',
                    icon: 'Database',
                  },
                  sort: {
                    direction: 'desc',
                  },
                },
              },
              {
                resource: MediaFileEntity,
                options: {
                  id: 'Medias',
                  parent: {
                    name: 'Assets',
                    icon: 'Database',
                  },
                  sort: {
                    direction: 'desc',
                  },
                },
              },
            ],
          },
          auth: authEnabled && {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'secret',
          },
          sessionOptions: authEnabled && {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
        }),
      }),
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CommonMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
