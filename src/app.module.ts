import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { typeOrmConfig } from './config/typeorm';
import { GroupModule } from './group/group.module';
import { PermissionModule } from './permission/permission.module';

import { CasbinModule } from './common/authz';
import { RoleModule } from './role/role.module';
import { ConnectionOptions } from 'typeorm';
import { GroupUserModule } from './group-user/group-user.module';
import { GroupRoleModule } from './group-role/group-role.module';
import { UserRoleModule } from './user-role/user-role.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    CasbinModule.forRootAsync(
      typeOrmConfig as ConnectionOptions,
      "src/common/authz/authz.model.conf"
    ),
    TypeOrmModule.forRoot(typeOrmConfig as TypeOrmModuleOptions),
    UserModule,
    GroupModule,
    PermissionModule,
    RoleModule,
    GroupUserModule,
    GroupRoleModule,
    UserRoleModule,
    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
