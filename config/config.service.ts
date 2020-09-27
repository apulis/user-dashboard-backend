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
    return this.envConfig['ENABLE_VC'] === 'true';
  }

  i18n() {
    if (this.envConfig['i18n'] === 'true') {
      return true
    } else {
      return this.envConfig['i18n']
    }
  }

}