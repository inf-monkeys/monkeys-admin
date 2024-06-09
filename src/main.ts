import { NestFactory } from '@nestjs/core';

import RedisStore from 'connect-redis';
import session, { MemoryStore } from 'express-session';
import { AppModule } from './app.module.js';
import { config, isRedisConfigured } from './common/config/index.js';
import { initRedisClient } from './common/redis/index.js';
import dataSource from './database/datasource.js';

async function bootstrap() {
  await dataSource.initialize();

  const app = await NestFactory.create(AppModule);

  // Authentication & Session
  app.use(
    session({
      store: isRedisConfigured()
        ? new RedisStore({
            client: initRedisClient(config.redis),
            prefix: config.redis.prefix || config.server.appId,
          })
        : new MemoryStore(),
      secret: config.auth.sessionSecret, // to sign session id
      resave: true, // will default to false in near future: https://github.com/expressjs/session#resave
      saveUninitialized: false, // will default to false in near future: https://github.com/expressjs/session#saveuninitialized
      rolling: true, // keep session alive
      cookie: {
        maxAge: 30 * 60 * 1000, // session expires in 1hr, refreshed by `rolling: true` option.
        httpOnly: true, // so that cookie can't be accessed via client-side script
      },
    }),
  );
  await app.listen(config.server.port);
}
bootstrap();
