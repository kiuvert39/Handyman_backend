import { Test, TestingModule } from '@nestjs/testing';
import { CraftmanService } from './craftman.service';

describe('CraftmanService', () => {
  let service: CraftmanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CraftmanService],
    }).compile();

    service = module.get<CraftmanService>(CraftmanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
