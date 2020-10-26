import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor(filePath?: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(process.env.CONFIG_PATH || 'develop.env'))
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  vcEnabled() {
    return this.envConfig['ENABLE_VC'] === 'True' || this.envConfig['ENABLE_VC'] === 'true';
  }

  i18n() {
    const env = this.envConfig['ENABLE_I18N'];
    if (env === 'True' || env === 'true') {
      return true
    } else {
      return env
    }
  }

  avisuals() {
    if (this.envConfig['ENABLE_AVISUALS'] === 'True' || this.envConfig['ENABLE_AVISUALS'] === 'true') {
      return true;
    }
    return false;
  }

}