import { DynamicModule, Module, Provider } from "@nestjs/common";
import { Adapter, Enforcer, DefaultRoleManager, newEnforcer } from "casbin";
import { ConnectionOptions } from "typeorm";
import TypeORMAdapter from "typeorm-adapter";
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
        const enforcer = await newEnforcer(casbinModelPath, (adapter as any) as Adapter);
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