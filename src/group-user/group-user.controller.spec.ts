import { Test, TestingModule } from '@nestjs/testing';
import { GroupUserController } from './group-user.controller';

describe('GroupUser Controller', () => {
  let controller: GroupUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupUserController],
    }).compile();

    controller = module.get<GroupUserController>(GroupUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
