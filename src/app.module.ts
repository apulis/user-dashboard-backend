import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserGroupController } from './user-group/user-group.controller';
import { RoleController } from './role/role.controller';
import databaseConfig from 'config/database.json';

import { AuthzMiddleware } from 'src/common/middleware/authz';
import { RoleService } from './role/role.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig as TypeOrmModule),
    UserModule,
  ],
  controllers: [AppController, UserController, UserGroupController, RoleController],
  providers: [AppService, RoleService, UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthzMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      })
  }
}
