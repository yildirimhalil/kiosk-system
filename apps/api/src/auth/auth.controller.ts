import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CustomThrottle } from 'src/common/decorators/custom-throttle.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Cfg } from 'src/config/cfg-keys';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @CustomThrottle([Cfg.limit.login, 10], [Cfg.ttl.ms, 60_000])
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }
}
