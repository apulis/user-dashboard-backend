import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { typeOrmConfig } from './db/typeorm';
import { GroupModule } from './group/group.module';
import { PermissionModule } from './permission/permission.module';

import { CasbinModule } from './common/authz';
import { RoleModule } from './role/role.module';
import { ConnectionOptions } from 'typeorm';
import { GroupUserModule } from './group-user/group-user.module';
import { GroupRoleModule } from './group-role/group-role.module';
import { UserRoleModule } from './user-role/user-role.module';
import { AuthModule } from './auth/auth.module';
import { PermissionService } from './permission/permission.service';
import { UserVcService } from './user-vc/user-vc.service';
import { Permission } from './permission/permission.entity';
import { RoleService } from './role/role.service';
import { Role } from './role/role.entity';
import { OpenModule } from './open/open.module';
import { UserService } from './user/user.service';
import { User } from './user/user.entity';
import { ConfigService } from 'config/config.service';
import { UserRoleService } from './user-role/user-role.service';
import { UserRole } from './user-role/user-role.entity';
import { LanguageModule } from './language/language.module';
import { UserVcModule } from './user-vc/user-vc.module';

 
@Module({
  imports: [
    CasbinModule.forRootAsync(
      { ...typeOrmConfig } as ConnectionOptions,
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
    TypeOrmModule.forFeature([Permission, Role, User, UserRole]),
    OpenModule,
    LanguageModule,
    UserVcModule
  ],
  controllers: [AppController],
  providers: [AppService, PermissionService, RoleService, UserService, ConfigService, UserRoleService, UserVcService],
})
export class AppModule {}
