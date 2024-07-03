import { ClusterNode, RedisOptions, SentinelAddress } from 'ioredis';
import { DataSourceOptions } from 'typeorm';

import { readConfig } from './readYaml.js';

export type DatabaseConfig = DataSourceOptions;

export interface ServerConfig {
  port: number;
  appId: string;
  appUrl: string;
  customization: {
    title: string;
    logo: {
      light: string;
      dark: string;
    };
    favicon: {
      light: string;
      dark: string;
    };
    colors: {
      primary: string;
    };
  };
}

export enum RedisMode {
  standalone = 'standalone',
  cluster = 'cluster',
  sentinel = 'sentinel',
}

export interface RedisConfig {
  mode: RedisMode;

  // Standalone config
  url?: string;

  // Cluster config
  nodes?: ClusterNode[];

  // Sentinel config
  sentinels?: Array<Partial<SentinelAddress>>;
  sentinelName?: string;

  // Common config
  prefix: string;
  options?: RedisOptions;
}

export interface AuthConfig {
  enabled?: boolean;
  defaultAdmin?: {
    email: string;
    password: string;
  };
  sessionSecret?: string;
}

export interface PricingConfig {
  defaultBalance: number;
}

export interface PaymentConfig {
  wxpay?: {
    appid: string;
    mchid: string;
    v3key: string;
    publicKey: string;
    privateKey: string;
    notifyUrl: string;
    orderDesc?: string;
  };
}

export interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  pricing: PricingConfig;
  auth: AuthConfig;
  payment: PaymentConfig;
}

const port = readConfig('server.port', 3000);
const appUrl = readConfig('server.appUrl', `http://127.0.0.1:${port}`);

const logoConfig = readConfig('server.customization.logo', {
  light: 'https://static.infmonkeys.com/logo/InfMonkeys-logo-light.svg',
  dark: 'https://static.infmonkeys.com/logo/InfMonkeys-logo-dark.svg',
});
const faviconConfig = readConfig('server.customization.favicon', 'https://static.infmonkeys.com/logo/InfMonkeys-ICO.svg');

export const config: Config = {
  server: {
    port,
    appId: readConfig('server.appId', 'monkeys'),
    appUrl,
    customization: {
      title: readConfig('server.customization.title', '猴子无限管理后台'),
      logo: typeof logoConfig === 'string' ? { light: logoConfig, dark: logoConfig } : logoConfig,
      favicon: typeof faviconConfig === 'string' ? { light: faviconConfig, dark: faviconConfig } : faviconConfig,
      colors: {
        primary: readConfig('server.customization.colors.primary', '#52ad1f'),
      },
    },
  },
  auth: {
    enabled: readConfig('auth.enabled', true),
    defaultAdmin: readConfig('auth.defaultAdmin', {
      email: 'admin@infmonkeys.com',
      password: 'monkeys123',
    }),
    sessionSecret: readConfig('auth.sessionSecret', 'monkeys'),
  },
  database: readConfig('database', {
    type: 'better-sqlite3',
    database: 'data/db.sqlite',
    synchronize: false,
  }),
  redis: {
    mode: readConfig('redis.mode', RedisMode.standalone),
    // Standalone config
    url: readConfig('redis.url'),
    // Cluster config
    nodes: readConfig('redis.nodes', []),
    // Sentinel config
    sentinels: readConfig('redis.sentinels', []),
    sentinelName: readConfig('redis.sentinelName'),
    // Common config
    prefix: readConfig('redis.prefix', 'monkeys:'),
    options: readConfig('redis.options', {}),
  },
  pricing: {
    defaultBalance: readConfig('pricing.defaultBalance', 10000),
  },
  payment: {
    wxpay: {
      appid: readConfig('payment.wxpay.appid'),
      mchid: readConfig('payment.wxpay.mchid'),
      v3key: readConfig('payment.wxpay.v3key'),
      publicKey: readConfig('payment.wxpay.publicKey'),
      privateKey: readConfig('payment.wxpay.privateKey'),
      notifyUrl: readConfig('payment.wxpay.notifyUrl'),
      orderDesc: readConfig('payment.wxpay.orderDesc', '猴子无限订单'),
    },
  },
};

export const isRedisConfigured = () => {
  if (config.redis.mode === RedisMode.standalone) {
    return !!config.redis.url;
  }
  if (config.redis.mode === RedisMode.cluster) {
    return !!config.redis.nodes.length;
  }
  if (config.redis.mode === RedisMode.sentinel) {
    return !!config.redis.sentinels.length && !!config.redis.sentinelName;
  }
  return false;
};
