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
    return this.envConfig['ENABLE_VC'] === 'True';
  }

  i18n() {
    if (this.envConfig['ENABLE_I18N'] === 'True') {
      return true
    } else {
      return this.envConfig['ENABLE_I18N']
    }
  }

}