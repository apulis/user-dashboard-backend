import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { ConfigService } from 'config/config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionService, ConfigService],
  controllers: [PermissionController],
})
export class PermissionModule {};
