import { Test, TestingModule } from '@nestjs/testing';
import { GroupRoleController } from './group-role.controller';

describe('GroupRole Controller', () => {
  let controller: GroupRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupRoleController],
    }).compile();

    controller = module.get<GroupRoleController>(GroupRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
