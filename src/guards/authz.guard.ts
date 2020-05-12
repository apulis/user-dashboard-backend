import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

const validateRequest = (request: any, permissionKey?: string): boolean => {
  if (permissionKey) {
    return request.user.permissionList.includes(permissionKey);
  }
  return true;
}


@Injectable()
export class AuthzGuard implements CanActivate {
  private permissionKey?: string
  constructor(permissionKey?: string) {
    this.permissionKey = permissionKey;
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request, this.permissionKey);
  }
}