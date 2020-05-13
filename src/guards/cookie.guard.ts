import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { Observable, VirtualTimeScheduler } from 'rxjs';
import { verify } from 'jsonwebtoken'
import { ConfigService } from 'config/config.service';
import { AuthService } from 'src/auth/auth.service';

const validateRequest = (request: any, JWT_SECRET_KEY: string): boolean => {
  const { cookies } = request;
  if (cookies) {
    const { token } = cookies;
    if (token) {
      try {
        const user = verify(token, JWT_SECRET_KEY);
        request.userId = (user as any).uid;
      } catch (err) {
        return false;
      }
      return true;
    }
    return false;
  }
  return false;
}


@Injectable()
export class CookieGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    if (validateRequest(request, this.configService.get('JWT_SECRET_KEY'))) {
      const user = await this.authService.validateUser(request.userId);
      request.user = user;
      return true
    };
    throw new UnauthorizedException();
  }
}