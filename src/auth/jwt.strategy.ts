import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'hkgaje75t62843qorgbry894q2375teufhtgyi7438qwert',
    });
  }

  async validate(payload: any): Promise<User | UnauthorizedException> {
    const user = await this.authService.validateUser(payload.userName);
    if (user) {
      return user;
    }
    return new UnauthorizedException('Authorized Error');
  }
}