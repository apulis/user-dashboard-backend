import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
  getRoleList(): string {
    return 'ok'
  }
  addRole(name: string, desc: string) {
    return 'ok'
  }
}
