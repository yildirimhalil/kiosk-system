/** Nested map → `process.env` keys (typo-safe). */
export const Cfg = {
  limit: {
    login: 'THROTTLE_LOGIN_LIMIT',
    global: 'THROTTLE_LIMIT',
  },
  ttl: {
    ms: 'THROTTLE_TTL_MS',
  },
  cache: {
    ttlMs: 'HTTP_CACHE_TTL_MS',
  },
  redis: {
    url: 'REDIS_URL',
  },
  trustProxy: 'TRUST_PROXY',
} as const;

export type CfgKey =
  | (typeof Cfg)['limit']['login']
  | (typeof Cfg)['limit']['global']
  | (typeof Cfg)['ttl']['ms']
  | (typeof Cfg)['cache']['ttlMs']
  | (typeof Cfg)['redis']['url']
  | (typeof Cfg)['trustProxy'];
