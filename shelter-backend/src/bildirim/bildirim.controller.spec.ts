import { Test, TestingModule } from '@nestjs/testing';
import { BildirimController } from './bildirim.controller';
import { BildirimService } from './bildirim.service';

describe('BildirimController', () => {
  let controller: BildirimController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BildirimController],
      providers: [BildirimService],
    }).compile();

    controller = module.get<BildirimController>(BildirimController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
