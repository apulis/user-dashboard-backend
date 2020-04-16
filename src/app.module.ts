import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { typeOrmConfig } from './config/typeorm';
import { GroupModule } from './group/group.module';
import { PermissionModule } from './permission/permission.module';

import { CasbinModule } from './common/authz';


@Module({
  imports: [
    CasbinModule.forRootAsync(
      {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "123456",
        database: "user_group"
      },
      "src/common/authz/authz.model.conf"
    ),
    TypeOrmModule.forRoot(typeOrmConfig as TypeOrmModuleOptions),
    UserModule,
    GroupModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
