import { CasbinModule } from "./casbin.module";
import { typeOrmConfig } from "src/db/typeorm";
import { ConnectionOptions } from "typeorm";

export const InitCasbin = CasbinModule.forRootAsync(
  typeOrmConfig as ConnectionOptions,
  "src/common/authz/authz.model.conf"
);