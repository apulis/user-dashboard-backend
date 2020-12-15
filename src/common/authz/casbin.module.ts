import { DynamicModule, Module, Provider } from "@nestjs/common";
import { Adapter, Enforcer, DefaultRoleManager, newEnforcer } from "casbin";
import { ConnectionOptions } from "typeorm";
import TypeORMAdapter from "typeorm-adapter";
import EtcdWatcher from '@casbin/etcd-watcher';
import { throttle } from 'lodash';

import { CASBIN_ENFORCER } from "./casbin.constants";
import { CasbinService } from "./casbin.service";


@Module({
})
export class CasbinModule {
  public static forRootAsync(
    dbConnectionOptions: ConnectionOptions,
    casbinModelPath: string
  ): DynamicModule {
    const casbinEnforcerProvider: Provider = {
      provide: CASBIN_ENFORCER,
      useFactory: async () => {
        const adapter = await TypeORMAdapter.newAdapter(dbConnectionOptions);
        const watcher = await EtcdWatcher.newWatcher({ hosts: 'http://127.0.0.1:2379' });
        const enforcer = await newEnforcer(casbinModelPath, (adapter as any) as Adapter);
        watcher.setUpdateCallback(() => {
          throttle(() => {
            enforcer.loadPolicy();
          }, 10000)
        })
        enforcer.setWatcher(watcher);
        return enforcer;
      },
      inject: []
    };
    return {
      exports: [casbinEnforcerProvider, CasbinService],
      module: CasbinModule,
      providers: [casbinEnforcerProvider, CasbinService]
    };
  }
}