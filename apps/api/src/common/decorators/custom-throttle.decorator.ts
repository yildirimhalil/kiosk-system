import { applyDecorators } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { envInt } from 'src/config/env';
import { Cfg } from 'src/config/cfg-keys';

export type CustomThrottleLimitKey =
  | typeof Cfg.limit.login
  | typeof Cfg.limit.global;
export type CustomThrottleTtlKey = typeof Cfg.ttl.ms;

export type CustomThrottleLimitPair = readonly [CustomThrottleLimitKey, number];
export type CustomThrottleTtlPair = readonly [CustomThrottleTtlKey, number];

export function CustomThrottle(
  limitPair: CustomThrottleLimitPair,
  ttlPair: CustomThrottleTtlPair,
) {
  return applyDecorators(
    Throttle({
      default: {
        limit: envInt(limitPair[0], limitPair[1]),
        ttl: envInt(ttlPair[0], ttlPair[1]),
      },
    }),
  );
}
