import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

const validateRequest = (request: any, permissionKey?: string | string[]): boolean => {
  if (permissionKey) {
    if (typeof permissionKey === 'string') {
      return request.user.permissionList.includes(permissionKey);
    }
    if (Array.isArray(permissionKey)) {
      return ((request.user.permissionList as string[]).filter(val => permissionKey.includes(val)))?.length > 0;
    }
  }
  return true;
}


@Injectable()
export class AuthzGuard implements CanActivate {
  private permissionKey?: string | string[]
  constructor(permissionKey?: string | string[]) {
    this.permissionKey = permissionKey;
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request, this.permissionKey);
  }
}