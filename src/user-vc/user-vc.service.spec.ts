import { Test, TestingModule } from '@nestjs/testing';
import { UserVcService } from './user-vc.service';

describe('UserVcService', () => {
  let service: UserVcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserVcService],
    }).compile();

    service = module.get<UserVcService>(UserVcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
