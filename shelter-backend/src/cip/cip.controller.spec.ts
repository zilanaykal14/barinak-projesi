import { Test, TestingModule } from '@nestjs/testing';
import { CipController } from './cip.controller';
import { CipService } from './cip.service';

describe('CipController', () => {
  let controller: CipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CipController],
      providers: [CipService],
    }).compile();

    controller = module.get<CipController>(CipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
