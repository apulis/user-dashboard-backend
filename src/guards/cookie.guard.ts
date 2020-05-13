import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { Observable, VirtualTimeScheduler } from 'rxjs';
import { verify } from 'jsonwebtoken'
import { ConfigService } from 'config/config.service';

const validateRequest = (request: any, JWT_SECRET_KEY: string): boolean => {
  const { cookies } = request;
  if (cookies) {
    const { token } = cookies;
    if (token) {
      try {
        const user = verify(token, JWT_SECRET_KEY);
        request.user = user;
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
    private readonly configService: ConfigService
  ) {
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (validateRequest(request, this.configService.get('JWT_SECRET_KEY'))) {
      return true
    };
    throw new UnauthorizedException();
  }
}