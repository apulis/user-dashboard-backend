import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { initialPermissions } from 'mysql-init/init-permission';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any): Promise<User | UnauthorizedException | any> {
    if (payload.uid === 30000) {
      // 其他平台调用
      return {
        userName: 'ADMIN_FOR_SELF',
        uid: 30000,
        permissionList: initialPermissions.map(val => val.key),
      }
    }
    const user = await this.authService.validateUser(payload.uid);
    if (user) {
      return user;
    }
    throw new UnauthorizedException('Authorized Error');
  }
}