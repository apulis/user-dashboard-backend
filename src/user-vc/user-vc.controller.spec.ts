import { Test, TestingModule } from '@nestjs/testing';
import { UserVcController } from './user-vc.controller';

describe('UserVc Controller', () => {
  let controller: UserVcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserVcController],
    }).compile();

    controller = module.get<UserVcController>(UserVcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
