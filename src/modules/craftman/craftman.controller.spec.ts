import { Test, TestingModule } from '@nestjs/testing';
import { CraftmanController } from './craftman.controller';
import { CraftmanService } from './craftman.service';

describe('CraftmanController', () => {
  let controller: CraftmanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CraftmanController],
      providers: [CraftmanService],
    }).compile();

    controller = module.get<CraftmanController>(CraftmanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
