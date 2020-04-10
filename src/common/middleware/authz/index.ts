import path from 'path';
import { Enforcer, newEnforcer } from 'casbin';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

import databaseConfig from 'config/database.json';
import TypeORMAdapter from 'typeorm-adapter';
import { ConnectionOptions } from 'typeorm';

interface IRequest extends Request {
  state: {
    currentUser?: any;
    enforcer?: any
  }
}

let a;
let initedAdapter = false;

// authz returns the authorizer, uses a Casbin enforcer as input
@Injectable()
export class AuthzMiddleware implements NestMiddleware {
  async use(req: IRequest, res: Response, next: Function) {
    if (!initedAdapter) {
      a = await TypeORMAdapter.newAdapter(databaseConfig as ConnectionOptions);
      initedAdapter = true;
    }
    const enforcer = await newEnforcer('src/common/middleware/authz/authz_model.conf', a);
    await enforcer.loadPolicy();
    if (!req.state) req.state = {};
    req.state.enforcer = enforcer;
    next();
  }
}

// BasicAuthorizer class stores the casbin handler
class BasicAuthorizer {
  public req: IRequest;
  public enforcer: Enforcer;
  constructor (req, enforcer) {
    this.req = req;
    this.enforcer = enforcer;
  }

  // getUserName gets the user name from the request.
  // Currently, only HTTP basic authentication is supported
  private getUserName () {
    // customize to get username from context
    const { currentUser: user } = this.req.state;
    const { userName } = user;
    return userName;
  }

  // checkPermission checks the user/method/path combination from the request.
  // Returns true (permission granted) or false (permission forbidden)
  async checkPermission () {
    const {req, enforcer} = this;
    const { originalUrl: path, method } = req;
    const user = this.getUserName();
    const isAllowed = await enforcer.enforce(user, path, method);
    return isAllowed;
  }
}