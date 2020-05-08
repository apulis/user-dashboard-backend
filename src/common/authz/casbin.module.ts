import { DynamicModule, Module, Provider } from "@nestjs/common";
import { Adapter, Enforcer, DefaultRoleManager, newEnforcer } from "casbin";
import { ConnectionOptions } from "typeorm";
import TypeORMAdapter from "typeorm-adapter";
import { CASBIN_ENFORCER, CASBIN_ROLE_MANAGER } from "./casbin.constants";
import { CasbinService } from "./casbin.service";

@Module({})
export class CasbinModule {
  public static forRootAsync(
    dbConnectionOptions: ConnectionOptions,
    casbinModelPath: string
  ): DynamicModule {
    const casbinEnforcerProvider: Provider = {
      provide: CASBIN_ENFORCER,
      useFactory: async () => {
        const adapter = await TypeORMAdapter.newAdapter(dbConnectionOptions);
        const enforcer = await newEnforcer(casbinModelPath, (adapter as any) as Adapter);
        return enforcer;
      }
    };
    const casbinRoleManagerProvider: Provider = {
      provide: CASBIN_ROLE_MANAGER,
      useFactory: async () => {
        const roleManager = await new DefaultRoleManager(10);
        return roleManager;
      }
    };
    return {
      exports: [casbinEnforcerProvider, casbinRoleManagerProvider, CasbinService],
      module: CasbinModule,
      providers: [casbinEnforcerProvider, casbinRoleManagerProvider, CasbinService]
    };
  }
}