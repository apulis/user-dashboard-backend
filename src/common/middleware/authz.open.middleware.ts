import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RBACOpenMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: Function) {
    console.log('req', req.path)
    next();
  }
}