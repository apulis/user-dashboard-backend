import { Test, TestingModule } from '@nestjs/testing';
import { PlatformConfigController } from './platform-config.controller';

describe('PlatformConfig Controller', () => {
  let controller: PlatformConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformConfigController],
    }).compile();

    controller = module.get<PlatformConfigController>(PlatformConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
