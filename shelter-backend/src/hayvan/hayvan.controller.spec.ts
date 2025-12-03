import { Test, TestingModule } from '@nestjs/testing';
import { HayvanController } from './hayvan.controller';
import { HayvanService } from './hayvan.service';

describe('HayvanController', () => {
  let controller: HayvanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HayvanController],
      providers: [HayvanService],
    }).compile();

    controller = module.get<HayvanController>(HayvanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
