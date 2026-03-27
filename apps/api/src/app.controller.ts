import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AppService } from './app.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @SkipThrottle()
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @SkipThrottle()
  @Public()
  @Get('health')
  async getHealth(): Promise<{
    status: string;
    redis: { enabled: boolean; ok: boolean };
  }> {
    const enabled = this.redisService.isEnabled();
    const ok = enabled ? await this.redisService.ping() : false;
    return {
      status: 'ok',
      redis: { enabled, ok },
    };
  }
}
