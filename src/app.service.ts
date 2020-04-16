import { Injectable, Inject } from '@nestjs/common';
import { Enforcer } from "casbin";
import {CASBIN_ENFORCER, CasbinService} from 'src/common/authz/index'

@Injectable()
export class AppService {
  constructor(
    @Inject(CASBIN_ENFORCER) private readonly enforcer: Enforcer,
    private readonly casbinService: CasbinService
  ) {}
  getHello(): object {
    return { a: 'b', c: 'b' };
  }
}
