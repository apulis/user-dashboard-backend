import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupController } from './user-group.controller';

describe('UserGroup Controller', () => {
  let controller: UserGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGroupController],
    }).compile();

    controller = module.get<UserGroupController>(UserGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
