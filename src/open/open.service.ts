import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config/config.service';

@Injectable()
export class OpenService {
  constructor(
    private readonly config: ConfigService
    ) {
      
    }
}
