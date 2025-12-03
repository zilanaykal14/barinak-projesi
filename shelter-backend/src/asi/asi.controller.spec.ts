import { Test, TestingModule } from '@nestjs/testing';
import { AsiController } from './asi.controller';
import { AsiService } from './asi.service';

describe('AsiController', () => {
  let controller: AsiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsiController],
      providers: [AsiService],
    }).compile();

    controller = module.get<AsiController>(AsiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
